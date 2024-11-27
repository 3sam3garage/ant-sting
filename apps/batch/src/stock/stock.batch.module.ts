import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  EconomicInformationDomainModule,
  FinancialStatementDomainModule,
  ForeignStockReportDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { StockCommand } from './commands';
import {
  HanaStockReportsCrawler,
  NaverStockReportsCrawler,
  ShinhanStockReportsCrawler,
} from './tasks';

@Module({
  imports: [
    FinancialStatementDomainModule,
    EconomicInformationDomainModule,
    StockReportDomainModule,
    ForeignStockReportDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.STOCK_REPORT_DETAIL,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK_PDF,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [
    StockCommand,
    NaverStockReportsCrawler,
    HanaStockReportsCrawler,
    ShinhanStockReportsCrawler,
  ],
})
export class StockBatchModule {}
