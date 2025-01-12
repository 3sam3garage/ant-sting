import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  EconomicInformationDomainModule,
  FinancialStatementDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { StockReportCommand } from './commands';
import {
  HanaStockReportsCrawler,
  KiwoomStockReportsCrawler,
  NaverStockReportsCrawler,
  ShinhanStockReportsCrawler,
} from './tasks';

@Module({
  imports: [
    FinancialStatementDomainModule,
    EconomicInformationDomainModule,
    StockReportDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [
    StockReportCommand,
    NaverStockReportsCrawler,
    HanaStockReportsCrawler,
    ShinhanStockReportsCrawler,
    KiwoomStockReportsCrawler,
  ],
})
export class StockReportBatchModule {}
