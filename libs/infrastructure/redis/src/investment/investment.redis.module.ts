import { Module } from '@nestjs/common';
import { REDIS_NAME } from '@libs/shared/config';
import { REDIS_REPOSITORY_TOKEN } from '@libs/application';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { SecFeedRedisRepository } from './sec-feed.redis.repository';
import { InvestmentRedisRepository } from './investment.redis.repository';

@Module({
  providers: [
    {
      provide: REDIS_REPOSITORY_TOKEN.INVESTMENT,
      useValue: InvestmentRedisRepository,
    },
    {
      provide: REDIS_REPOSITORY_TOKEN.SEC_FEED,
      useValue: SecFeedRedisRepository,
    },
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
  exports: [REDIS_REPOSITORY_TOKEN.INVESTMENT, REDIS_REPOSITORY_TOKEN.SEC_FEED],
})
export class InvestmentRedisModule {}
