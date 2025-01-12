import { Module } from '@nestjs/common';
import { TickerDomainModule } from '@libs/domain';
import { SecTickerFetcher } from './tasks';
import { StockCommand } from './commands';

@Module({
  imports: [
    TickerDomainModule,
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
  providers: [StockCommand, SecTickerFetcher],
})
export class StockBatchModule {}
