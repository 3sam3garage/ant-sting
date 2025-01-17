import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Cron } from '@nestjs/schedule';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { TICKER_SNIPPETS_SET } from '@libs/domain';

@Injectable()
export class RealtimeShortScrapeJob {
  private isRunning = false;

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    @InjectQueue(QUEUE_NAME.SCRAPE_REALTIME_SHORT)
    private queue: Queue,
  ) {}

  async run() {
    const tickers = await this.redis.smembers(TICKER_SNIPPETS_SET);

    const jobs = [];
    for (const ticker of tickers) {
      jobs.push({
        data: { ticker },
        opts: { attempts: 5, removeOnComplete: true, removeOnFail: false },
      });
    }

    await this.queue.addBulk(jobs);
  }

  @Cron('*/30 * * * *', { timeZone: 'Asia/Seoul' })
  async handle(): Promise<void> {
    Logger.log(`${new Date()} realtime-short-scraper scheduler start`);

    if (this.isRunning) {
      Logger.warn('이미 realtime-short-scraper 스케줄러가 동작중입니다.');
      return;
    }

    try {
      this.isRunning = true;
      await this.run();
    } catch (error: unknown) {
      Logger.error('realtime-short-scraper 중 에러 발생', {
        error: error.toString(),
      });
    } finally {
      this.isRunning = false;
    }
  }
}
