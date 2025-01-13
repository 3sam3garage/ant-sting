import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_NAME } from '@libs/config';

@Injectable()
export class TickerService {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private redis: Redis,
  ) {}

  async findSnippets(): Promise<string[]> {
    // await this.redis.set('ticker-list', JSON.stringify(['QSI', 'RGTI']));

    const text = await this.redis.get('ticker-snippets');
    return JSON.parse(text);
  }
}
