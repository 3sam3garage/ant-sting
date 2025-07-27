import { BullModule } from '@nestjs/bull';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  PortfolioDomainModule,
  SecCompanyDomainModule,
  SecFilingDomainModule,
} from '@libs/domain-mongo';
import { AiModule } from '@libs/ai';
import { ExternalApiModule } from '@libs/external-api';
import { BrowserModule } from '@libs/browser';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { InvestmentRedisModule } from '@libs/domain-redis';

import { PocCommand } from './commands';
import { GraphEconomicInformationTask } from './tasks/graph-economic-information.task';
import { Sec13fTask } from './tasks/sec-13f.task';
import { ScrapeRssTask } from './tasks/scrape-rss.task';

@Module({
  imports: [
    AiModule,
    ExternalApiModule,
    EconomicInformationDomainModule,
    SecCompanyDomainModule,
    SecFilingDomainModule,
    BrowserModule,
    InvestmentRedisModule,
    PortfolioDomainModule,
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
    GraphEconomicInformationTask,
    Sec13fTask,
    ScrapeRssTask,
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
