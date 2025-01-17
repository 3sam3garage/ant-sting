import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import {
  REALTIME_SHORT_INTEREST_REDIS_KEY,
  ShortInterestRepository,
} from '@libs/domain';
import { REDIS_NAME } from '@libs/config';
import { FindShortInterestQuery, ShortInterestResponse } from '../dto';

@Injectable()
export class ShortInterestService {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly shortInterestRepository: ShortInterestRepository,
  ) {}

  async findOneByTicker({ ticker }: FindShortInterestQuery) {
    const entity = await this.shortInterestRepository.findOne({
      where: { ticker },
    });

    return ShortInterestResponse.fromEntity(entity);
  }

  async findOneRealtimeByTicker({ ticker }: FindShortInterestQuery) {
    const item = await this.redis.get(
      `${REALTIME_SHORT_INTEREST_REDIS_KEY}:${ticker}`,
    );

    return JSON.parse(item);
  }
}
