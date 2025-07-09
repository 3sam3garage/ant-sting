import { Module } from '@nestjs/common';
import { InvestmentRedisRepository } from './investment.redis.repository';
import { REDIS_NAME } from '@libs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  providers: [
    InvestmentRedisRepository,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
  exports: [InvestmentRedisRepository],
})
export class InvestmentRedisModule {}
