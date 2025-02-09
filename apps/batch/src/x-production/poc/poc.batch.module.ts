import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { PocCommand } from './commands';
import {
  RealtimeShortInterestCrawler,
  MacroAnalysisDraft,
  StockMarketNewsCrawler,
} from './tasks';
import { ExternalApiModule } from '@libs/external-api';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { BrowserModule } from '@libs/browser';
import { AiModule } from '@libs/ai';
import {
  BondYieldDomainModule,
  EconomicInformationDomainModule,
  ExchangeRateDomainModule,
  FinancialStatementDomainModule,
  InterestRateDomainModule,
  StockIndexDomainModule,
  StockMarketNewsDomainModule,
  StockReportDomainModule,
  TickerDomainModule,
} from '@libs/domain';

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
    StockMarketNewsDomainModule,
    ExternalApiModule,
    BrowserModule,
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
      {
        name: QUEUE_NAME.SCRAPE_REALTIME_SHORT,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
      {
        name: QUEUE_NAME.ANALYZE_MARKET_NEWS,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
    ),
  ],
  providers: [
    PocCommand,
    MacroAnalysisDraft,
    RealtimeShortInterestCrawler,
    StockMarketNewsCrawler,
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
