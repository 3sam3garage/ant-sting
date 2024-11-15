import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  MacroEnvironmentDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ReportCrawlerCommand } from './commands';
import {
  MacroEnvironmentCrawlerTask,
  RecommendPortfolioTask,
  StockReportCrawlerTask,
  SummarizeMacroEnvironmentTask,
} from './tasks';

@Module({
  imports: [
    MacroEnvironmentDomainModule,
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
    RecommendPortfolioTask,
    SummarizeMacroEnvironmentTask,
  ],
})
export class ReportBatchModule {}
