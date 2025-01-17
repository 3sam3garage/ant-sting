import { Module } from '@nestjs/common';
import {
  BondYieldDomainModule,
  EconomicInformationDomainModule,
  ExchangeRateDomainModule,
  FinancialStatementDomainModule,
  InterestRateDomainModule,
  StockIndexDomainModule,
  StockReportDomainModule,
  TickerDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { TestCommand } from './commands';
import { BrowserProxyCrawlerTask, TestTask } from './tasks';
import { ExternalApiModule } from '@libs/external-api';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    AiModule,
    FinancialStatementDomainModule,
    EconomicInformationDomainModule,
    StockReportDomainModule,
    BondYieldDomainModule,
    ExchangeRateDomainModule,
    InterestRateDomainModule,
    StockIndexDomainModule,
    TickerDomainModule,
    ExternalApiModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.ECONOMIC_INFORMATION,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
      {
        name: QUEUE_NAME.ANALYZE_STOCK,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
      {
        name: QUEUE_NAME.FETCH_FILING,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
    ),
  ],
  providers: [
    TestCommand,
    TestTask,
    BrowserProxyCrawlerTask,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class TestBatchModule {}
