import { Module } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { PortfolioMongoModule } from '@libs/infrastructure/mongo';
import { InvestmentRedisModule } from '@libs/infrastructure/redis';
import { ExternalApiModule } from '@libs/infrastructure/external-api';
import { ScrapeRssJob } from './jobs';
import {
  QUEUE_NAME,
  REDIS_NAME,
  RedisConfigService,
} from '@libs/shared/config';
import { BrowserModule } from '@libs/infrastructure/browser';

@Module({
  imports: [
    PortfolioMongoModule,
    ExternalApiModule,
    InvestmentRedisModule,
    BrowserModule,
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
