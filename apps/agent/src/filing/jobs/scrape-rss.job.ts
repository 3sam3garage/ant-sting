import { Inject, Injectable, Logger } from '@nestjs/common';
import { QUEUE_NAME } from '@libs/shared/config';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { errorToJson } from '@libs/shared/common';
import { AnalyzeSec13fMessage } from '@libs/shared/core';
import {
  EXTERNAL_API_TOKEN,
  REDIS_REPOSITORY_TOKEN,
  SecApiImpl,
} from '@libs/application';
import { SecFeedRepositoryImpl } from '@libs/domain';

@Injectable()
export class ScrapeRssJob {
  private isRunning = false;

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_13F)
    private readonly queue: Queue,
    @Inject(EXTERNAL_API_TOKEN.SLACK_API)
    private readonly secApiService: SecApiImpl,
    @Inject(REDIS_REPOSITORY_TOKEN.SEC_FEED)
    private readonly secFeedRedisRepository: SecFeedRepositoryImpl,
  ) {}

  async run() {
    const rss = await this.secApiService.fetchRSS();
    for (const feed of rss.feedsEntries) {
      const url = feed.href;

      const processed = await this.secFeedRedisRepository.exists(url);
      if (processed) {
        Logger.log(`이미 처리된 URL: ${url}`);
        continue;
      }

      const message: AnalyzeSec13fMessage = { url };
      await Promise.all([
        this.queue.add(message, { removeOnComplete: true }),
        this.secFeedRedisRepository.addToSet(url),
      ]);
    }
  }

  @Cron('*/5 * * * *', { timeZone: 'Asia/Seoul' })
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
