import { Module } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { PortfolioDomainModule } from '@libs/mongo';
import { InvestmentRedisModule } from '@libs/redis';
import { ExternalApiModule } from '@libs/external-api';
import { ScrapeRssJob } from './jobs';

@Module({
  imports: [
    PortfolioDomainModule,
    ExternalApiModule,
    InvestmentRedisModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_13F,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [
    ScrapeRssJob,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class FilingModule {}
