import { Module } from '@nestjs/common';
import { SecTickerFetcher } from './tasks';

@Module({
  imports: [
    // FinancialStatementDomainModule,
    // EconomicInformationDomainModule,
    // StockReportDomainModule,
    // BullModule.registerQueueAsync({
    //   name: QUEUE_NAME.ANALYZE_STOCK,
    //   inject: [RedisConfigService],
    //   useFactory: async (config: RedisConfigService) => {
    //     return { redis: config.getConfig() };
    //   },
    // }),
  ],
  providers: [SecTickerFetcher],
})
export class StockBatchModule {}
