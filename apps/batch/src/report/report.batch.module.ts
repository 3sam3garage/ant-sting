import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  InvestReportDomainModule,
  MarketInfoReportDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ReportCrawlerCommand } from './commands';
import { InvestReportCrawlerTask, MarketInfoReportCrawlerTask } from './tasks';

@Module({
  imports: [
    InvestReportDomainModule,
    MarketInfoReportDomainModule,
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
    ),
  ],
  providers: [
    ReportCrawlerCommand,
    InvestReportCrawlerTask,
    MarketInfoReportCrawlerTask,
  ],
})
export class ReportBatchModule {}
