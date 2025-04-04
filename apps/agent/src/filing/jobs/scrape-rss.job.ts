import { Inject, Injectable, Logger } from '@nestjs/common';
import { Filing, FilingRepository, TickerRepository } from '@libs/domain';
import { SecApiService } from '@libs/external-api';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { Redis } from 'ioredis';
import { format } from 'date-fns';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ScrapeRssJob {
  private isRunning = false;

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    @InjectQueue(QUEUE_NAME.ANALYZE_FILING)
    private readonly queue: Queue,
    private readonly tickerRepository: TickerRepository,
    private readonly filingRepository: FilingRepository,
    private readonly secApiService: SecApiService,
  ) {}

  private figureCIKFromTitle(title: string): number {
    const [match] = title.match(/(?<=\()\d{10}(?=\))/);
    return +match;
  }

  async run() {
    const rss = await this.secApiService.fetchRSS();
    const feeds = rss?.feed?.entry || [];

    for (const feed of feeds) {
      const url = feed?.link?.$?.href || '';

      const cik = this.figureCIKFromTitle(feed.title);
      const formType = feed?.category?.$?.term?.trim() || '';
      const date = format(new Date(feed.updated), 'yyyy-MM-dd'); // KST
      const foundTickerEntity = await this.tickerRepository.findOne({
        where: { cik },
      });
      const foundFiling = await this.filingRepository.findOne({
        where: { url },
      });

      switch (true) {
        // `filing`이 이미 존재하는 경우
        case !!foundFiling:
        // `ticker`가 없는 종목일 경우
        case !foundTickerEntity:
          continue;
      }

      const ticker = foundTickerEntity?.ticker;
      const entity = Filing.create({ url, cik, ticker, formType, date });
      const result = await this.filingRepository.save(entity);

      await this.queue.add(
        { filingId: result._id.toString() },
        { removeOnComplete: true, removeOnFail: false },
      );
    }
  }

  @Cron('* * * * *', { timeZone: 'Asia/Seoul' })
  async handle(): Promise<void> {
    Logger.log(`${new Date()} scrape-sec-rss scheduler start`);

    if (this.isRunning) {
      Logger.warn('이미 scrape-sec-rss 스케줄러가 동작중입니다.');
      return;
    }

    try {
      this.isRunning = true;
      await this.run();
    } catch (error: unknown) {
      Logger.error('scrape-sec-rss 중 에러 발생', { error: error.toString() });
    } finally {
      this.isRunning = false;
    }
  }
}
