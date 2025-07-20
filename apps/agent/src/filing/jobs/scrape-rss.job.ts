import { Injectable, Logger } from '@nestjs/common';
import { SecFilingRepository, AnalyzeSec13fMessage } from '@libs/domain-mongo';
import { SecApiService } from '@libs/external-api';
import { QUEUE_NAME } from '@libs/config';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { errorToJson } from '@libs/common';

@Injectable()
export class ScrapeRssJob {
  private isRunning = false;

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_13F)
    private readonly queue: Queue,
    private readonly filingRepository: SecFilingRepository,
    private readonly secApiService: SecApiService,
  ) {}

  async run() {
    const rss = await this.secApiService.fetchRSS();
    const feeds = rss?.feed?.entry || [];

    for (const feed of feeds) {
      const url = feed?.link?.$?.href || '';
      await this.queue.add({ url } as AnalyzeSec13fMessage, {
        removeOnComplete: false,
        removeOnFail: false,
      });
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
      Logger.error('scrape-sec-rss 중 에러 발생', errorToJson(error as Error));
    } finally {
      this.isRunning = false;
    }
  }
}
