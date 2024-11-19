import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  EconomicInformationDomainModule,
  FinancialStatementDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { StockCommand } from './commands';
import { ScrapeStockReportCrawler } from './tasks';

@Module({
  imports: [
    FinancialStatementDomainModule,
    EconomicInformationDomainModule,
    StockReportDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.STOCK_REPORT_SUMMARY,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [StockCommand, ScrapeStockReportCrawler],
})
export class StockBatchModule {}
