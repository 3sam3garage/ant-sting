import { Redis } from 'ioredis';
import { Cron } from '@nestjs/schedule';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { TICKER_SNIPPETS_SET, TickerRepository } from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UpdateFilingJob {
  private isRunning = false;

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    @InjectQueue(QUEUE_NAME.FETCH_FILING)
    private readonly queue: Queue,
    private readonly tickerRepository: TickerRepository,
  ) {}

  private async run(): Promise<void> {
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

  @Cron('*/5 * * * *', { timeZone: 'Asia/Seoul' })
  async handle(): Promise<void> {
    Logger.log(`${new Date()} filing update scheduler start`);

    if (this.isRunning) {
      Logger.warn('이미 filing 업데이트 스케줄러가 동작중입니다.');
      return;
    }

    try {
      this.isRunning = true;
      await this.run();
    } catch (error: unknown) {
      Logger.error('filing 업데이트 중 에러 발생', { error });
    } finally {
      this.isRunning = false;
    }
  }
}
