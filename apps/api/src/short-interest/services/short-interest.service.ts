import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import {
  REALTIME_SHORT_INTEREST_REDIS_KEY,
  ShortInterestRepository,
} from '@libs/domain';
import { REDIS_NAME } from '@libs/config';
import { FindShortInterestQuery, ShortInterestResponse } from '../dto';
import { differenceInMinutes } from 'date-fns';

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
    const text = await this.redis.get(
      `${REALTIME_SHORT_INTEREST_REDIS_KEY}:${ticker}`,
    );

    const now = new Date();
    const json: any[] = JSON.parse(text) || [];
    return json.map(({ timestamp, quantity }) => {
      const relativeTime = differenceInMinutes(now, new Date(timestamp));

      return {
        relativeTime: `${relativeTime} Min Ago`,
        timestamp,
        quantity,
      };
    });
  }
}
