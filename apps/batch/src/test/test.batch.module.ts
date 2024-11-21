import { Module } from '@nestjs/common';
import {
  EconomicInformationAnalysisDomainModule,
  EconomicInformationDomainModule,
  FinancialStatementDomainModule,
  StockAnalysisDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { TestCommand } from './commands';
import { TestTask } from './tasks';
import { ExternalApiModule } from '@libs/external-api';

@Module({
  imports: [
    AiModule,
    StockAnalysisDomainModule,
    FinancialStatementDomainModule,
    EconomicInformationDomainModule,
    EconomicInformationAnalysisDomainModule,
    StockReportDomainModule,
    ExternalApiModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.STOCK_REPORT_DETAIL,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.ECONOMIC_INFORMATION,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.ANALYZE_STOCK,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
    ),
  ],
  providers: [TestCommand, TestTask],
})
export class TestBatchModule {}
