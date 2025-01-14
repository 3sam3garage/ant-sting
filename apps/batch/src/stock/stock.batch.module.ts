import { Module } from '@nestjs/common';
import { FilingDomainModule, TickerDomainModule } from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';
import { ScrapeRssFetcher, SecTickerFetcher } from './tasks';
import { StockCommand } from './commands';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { REDIS_NAME } from '@libs/config';

@Module({
  imports: [
    TickerDomainModule,
    FilingDomainModule,
    ExternalApiModule,

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
  providers: [
    StockCommand,
    SecTickerFetcher,
    ScrapeRssFetcher,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class StockBatchModule {}
