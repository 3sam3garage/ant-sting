import { plainToInstance } from 'class-transformer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { ChromiumService } from '@libs/infrastructure/browser';
import { SecApiService, SlackApi } from '@libs/infrastructure/external-api';
import { InvestmentRedisRepository } from '@libs/infrastructure/redis';
import { PortfolioRepository } from '@libs/infrastructure/mongo';
import { PortfolioRepositoryImpl, Portfolio } from '@libs/domain';
import { StockInventory } from '../interface';

@Injectable()
export class Sec13fTask {
  constructor(
    private readonly secApi: SecApiService,
    private readonly chromiumService: ChromiumService,
    private readonly slackApi: SlackApi,
    private readonly investmentRedisRepo: InvestmentRedisRepository,
    @Inject(PortfolioRepository)
    private readonly portfolioRepo: PortfolioRepositoryImpl,
  ) {}

  private async figureInvestments(url: string): Promise<StockInventory[]> {
    const page = await this.chromiumService.getPage();

    await page.goto(url);

    const text = await page.evaluate(() => {
      return document.querySelector('pre').innerText;
    });

    const [match] = text
      .replaceAll('ns1:', '')
      .match(/<informationTable[^>]*>([\s\S]*?)<\/informationTable>/);

    const parsed: { informationTable: { infoTable: StockInventory[] } } =
      await parseStringPromise(match, {
        trim: true,
        explicitArray: false,
        emptyTag: () => null,
      });
    const investmentItems = parsed.informationTable?.infoTable || [];
    if (!Array.isArray(investmentItems)) {
      return [];
    }

    return investmentItems.map((item) => plainToInstance(StockInventory, item));
  }

  async exec() {
    /**
     * @todo Process consumer로 분리
     */
    const url =
      'https://www.sec.gov/Archives/edgar/data/1940917/000194091725000004/0001940917-25-000004-index.htm';
    const cik = url.split('/')[6];

    const filing = await this.secApi.fetchSubmission(cik);
    const { issuer, items } = filing.filterBut13FHR();
    if (items.length === 0) {
      Logger.debug('13F-HR filings 이 없습니다.:', cik);
      return;
    }

    const entities: Portfolio[] = [];
    for (const info of items.slice(0, 2)) {
      const { url, date } = info;
      const items = await this.figureInvestments(url);
      const totalValue = items.reduce(
        (acc, item) => acc + Number(item.value),
        0,
      );

      entities.push(
        plainToInstance(Portfolio, {
          issuer,
          url,
          date,
          totalValue,
          items: items.map((item) =>
            item.toPortfolioItem(date, totalValue, item),
          ),
        }),
      );
    }

    const [portfolio, prevPortfolio] = entities;

    switch (true) {
      case !portfolio:
        Logger.error('포트폴리오를 찾을 수 없습니다.');
        return;
      case !prevPortfolio:
        Logger.error('이전 포트폴리오를 찾을 수 없습니다.');
        return;
    }

    const { added, removed } = Portfolio.figureAddedAndRemoved(
      portfolio,
      prevPortfolio,
    );

    console.log(added, removed);
  }
}
