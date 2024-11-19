import { Module } from '@nestjs/common';
import { StockReportDomainModule } from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { AnalyzeStockConsumer } from './service';

@Module({
  imports: [
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [AnalyzeStockConsumer],
})
export class AnalyzeStockModule {}
