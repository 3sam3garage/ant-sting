import { Injectable, Logger } from '@nestjs/common';
import { SecApiService, SlackApi } from '@libs/external-api';
import { ChromiumService } from '@libs/browser';
import { parseStringPromise } from 'xml2js';
import { InvestmentRedisRepository } from '@libs/redis';
import { PortfolioRepository, Portfolio } from '@libs/mongo';
import { plainToInstance } from 'class-transformer';
import { StockInventory } from '../interface';

@Injectable()
export class Sec13fTask {
  constructor(
    private readonly secApi: SecApiService,
    private readonly chromiumService: ChromiumService,
    private readonly slackApi: SlackApi,
    private readonly investmentRedisRepo: InvestmentRedisRepository,
    private readonly portfolioRepo: PortfolioRepository,
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
    const { issuer, items } = filing.filterBut13FHRs();
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

    // 오래된 포트폴리오 정보부터 생성 (비교데이터 있는지 확인 위해)
    for (const entity of entities) {
      const prevEntity = await this.portfolioRepo.findOne({
        where: { url: entity.url },
      });

      console.log(prevEntity);
    }
  }
}
