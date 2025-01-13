import { Module } from '@nestjs/common';
import {
  FinancialStatementDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { AiModule } from '@libs/ai';
import { StockReportConsumer } from './service';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';

@Module({
  imports: [
    FinancialStatementDomainModule,
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [StockReportConsumer],
})
export class StockReportModule {}
