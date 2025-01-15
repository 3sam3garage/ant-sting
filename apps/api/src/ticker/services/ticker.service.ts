import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_NAME } from '@libs/config';
import { TICKER_SNIPPETS_SET, TickerRepository } from '@libs/domain';

@Injectable()
export class TickerService {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private redis: Redis,
    private readonly tickerRepository: TickerRepository,
  ) {}

  async findSnippets(): Promise<string[]> {
    return (await this.redis.smembers(TICKER_SNIPPETS_SET)) || [];
  }

  async find() {
    return this.tickerRepository.find();
  }

  async deleteSnippets(ticker: string) {
    await this.redis.srem(TICKER_SNIPPETS_SET, ticker);
  }

  async addSnippet(ticker: string) {
    await this.redis.sadd(TICKER_SNIPPETS_SET, ticker);
  }
}
