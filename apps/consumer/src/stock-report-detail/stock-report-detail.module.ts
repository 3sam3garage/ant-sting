import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { StockReportDetailConsumer } from './service';

@Module({
  imports: [
    EconomicInformationDomainModule,
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.STOCK_REPORT_DETAIL,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [StockReportDetailConsumer],
})
export class StockReportDetailModule {}
