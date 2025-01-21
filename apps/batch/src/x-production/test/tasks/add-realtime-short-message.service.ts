import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { TICKER_SNIPPETS_SET } from '@libs/domain';

@Injectable()
export class AddRealtimeShortMessageService {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    @InjectQueue(QUEUE_NAME.SCRAPE_REALTIME_SHORT)
    private queue: Queue,
  ) {}

  async exec(): Promise<void> {
    const tickers = await this.redis.smembers(TICKER_SNIPPETS_SET);

    const jobs = [];
    for (const ticker of tickers) {
      jobs.push({
        data: { ticker },
        opts: {
          attempts: 5,
          removeOnComplete: true,
          removeOnFail: false,
          jobId: ticker,
        },
      });
    }

    await this.queue.addBulk(jobs);
  }
}
