import { Redis } from 'ioredis';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { TICKER_SNIPPETS_SET, TickerRepository } from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TestTask2 {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    @InjectQueue(QUEUE_NAME.FETCH_FILING)
    private readonly queue: Queue,
    private readonly tickerRepository: TickerRepository,
  ) {}

  async exec(): Promise<void> {
    const tickers = await this.redis.smembers(TICKER_SNIPPETS_SET);

    for (const ticker of tickers) {
      const entity = await this.tickerRepository.findOne({ where: { ticker } });
      if (!entity) {
        Logger.debug(`Ticker not found: ${ticker}`);
        continue;
      }

      const tickerId = entity._id.toString();
      await this.queue.add(
        { tickerId },
        { removeOnComplete: true, removeOnFail: true, jobId: tickerId },
      );
    }
  }
}
