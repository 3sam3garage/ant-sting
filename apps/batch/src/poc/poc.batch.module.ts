import { BullModule } from '@nestjs/bull';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import {
  EconomicInformationMongoModule,
  PortfolioMongoModule,
} from '@libs/infrastructure/mongo';
import { AiModule } from '@libs/infrastructure/ai';
import { ExternalApiModule } from '@libs/infrastructure/external-api';
import { BrowserModule } from '@libs/infrastructure/browser';
import { InvestmentRedisModule } from '@libs/infrastructure/redis';
import {
  QUEUE_NAME,
  REDIS_NAME,
  RedisConfigService,
} from '@libs/shared/config';

import { PocCommand } from './commands';
import { Sec13fTask } from './tasks/sec-13f.task';
import { ScrapeRssTask } from './tasks/scrape-rss.task';
import { PostWepollTask } from './tasks/post-wepoll.task';

@Module({
  imports: [
    AiModule,
    ExternalApiModule,
    EconomicInformationMongoModule,
    BrowserModule,
    InvestmentRedisModule,
    PortfolioMongoModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_13F,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [
    PocCommand,
    Sec13fTask,
    ScrapeRssTask,
    PostWepollTask,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class PocBatchModule {}
