import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  DebentureReportDomainModule,
  EconomyReportDomainModule,
  IndustryReportDomainModule,
  InvestReportDomainModule,
  MarketInfoReportDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ReportCrawlerCommand } from './commands';
import { MacroEnvironmentCrawlerTask, StockReportCrawlerTask } from './tasks';

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
        name: QUEUE_NAME.STOCK_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.MACRO_ENVIRONMENT,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
    ),
  ],
  providers: [
    ReportCrawlerCommand,
    MacroEnvironmentCrawlerTask,
    StockReportCrawlerTask,
  ],
})
export class ReportBatchModule {}
