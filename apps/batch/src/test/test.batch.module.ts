import { Module } from '@nestjs/common';
import {
  DebentureReportDomainModule,
  EconomyReportDomainModule,
  IndustryReportDomainModule,
  InvestReportDomainModule,
  MarketInfoReportDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { TestCommand } from './commands';
import { ReportSummaryTask, TestTask } from './tasks';

@Module({
  imports: [
    InvestReportDomainModule,
    MarketInfoReportDomainModule,
    DebentureReportDomainModule,
    EconomyReportDomainModule,
    IndustryReportDomainModule,
    StockReportDomainModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.INVEST_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.MARKET_INFO_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.INDUSTRY_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.ECONOMY_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.DEBENTURE_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.STOCK_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.REPORT_SUMMARY,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
    ),
  ],
  providers: [TestCommand, TestTask, ReportSummaryTask],
})
export class TestBatchModule {}
