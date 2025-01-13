import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { FilingRepository } from '@libs/domain';
import { REDIS_NAME } from '@libs/config';
import { FindFilingsQuery } from '../dto';

@Injectable()
export class FilingService {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private redis: Redis,
    private readonly repo: FilingRepository,
  ) {}

  async findByTickers(query: FindFilingsQuery) {
    return await this.repo.find({
      where: {
        ticker: { $in: [...query.tickers] },
      },
    });
  }

  async findTickerList(): Promise<string[]> {
    // await this.redis.set('ticker-list', JSON.stringify(['QSI', 'RGTI']));

    const text = await this.redis.get('ticker-list');
    return JSON.parse(text);
  }
}
