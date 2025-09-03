import { Inject, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { format } from 'date-fns';
import { parseStringPromise } from 'xml2js';
import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { AnalyzeSec13fMessage } from '@libs/shared/core';
import { QUEUE_NAME } from '@libs/shared/config';
import {
  StockInventory,
  Portfolio,
  PortfolioRepositoryImpl,
} from '@libs/domain';
import {
  BrowserImpl,
  BROWSERS_TOKEN,
  EXTERNAL_API_TOKEN,
  MONGO_REPOSITORY_TOKEN,
  SecApiImpl,
} from '@libs/application';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_13F)
export class Analyze13fConsumer extends BaseConsumer {
  constructor(
    @Inject(BROWSERS_TOKEN.CHROMIUM)
    private readonly chromiumService: BrowserImpl,
    @Inject(MONGO_REPOSITORY_TOKEN.PORTFOLIO)
    private readonly portfolioRepo: PortfolioRepositoryImpl,
    @Inject(EXTERNAL_API_TOKEN.SEC_API_SERVICE)
    private readonly secApi: SecApiImpl,
    @InjectQueue(QUEUE_NAME.NOTIFY_13F)
    private readonly queue: Queue,
  ) {
    super();
  }

  private async figureStockInventory(url: string): Promise<StockInventory[]> {
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

  @Process({ concurrency: 1 })
  async run({ data: { url } }: Job<AnalyzeSec13fMessage>) {
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
      const items = await this.figureStockInventory(url);
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
    for (const entity of entities.reverse()) {
      const prevEntity = await this.portfolioRepo.findOneByUrl(entity.url);

      if (!prevEntity) {
        const result = await this.portfolioRepo.save(entity);
        if (
          result.date === format(new Date(), 'yyyy-MM-dd') &&
          result.totalValue > 10_000_000_000 / 2
        ) {
          await this.queue.add(
            { _id: result._id.toString(), issuer: result.issuer },
            { removeOnComplete: true },
          );
        }
      }
    }
  }
}
