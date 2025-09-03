import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_NAME } from '@libs/shared/config';
import { SecFeedRepositoryImpl } from '@libs/domain';

@Injectable()
export class SecFeedRedisRepository implements SecFeedRepositoryImpl {
  private readonly SET_NAME = 'SEC_FEED_URL';

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
  ) {}

  async addToSet(url: string): Promise<void> {
    await this.redis.sadd(this.SET_NAME, url);
  }

  async exists(url: string): Promise<boolean> {
    const exists = await this.redis.sismember(this.SET_NAME, url);
    return exists === 1;
  }
}
