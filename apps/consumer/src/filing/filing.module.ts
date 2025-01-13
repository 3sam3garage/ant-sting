import { Module } from '@nestjs/common';
import { AiModule } from '@libs/ai';
import { AnalyzeFilingConsumer, FetchFilingConsumer } from './service';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { FilingDomainModule, TickerDomainModule } from '@libs/domain';

@Module({
  imports: [
    AiModule,
    TickerDomainModule,
    FilingDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_FILING,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.FETCH_FILING,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [AnalyzeFilingConsumer, FetchFilingConsumer],
})
export class FilingModule {}
