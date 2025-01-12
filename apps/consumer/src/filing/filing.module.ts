import { Module } from '@nestjs/common';
import { AiModule } from '@libs/ai';
import { AnalyzeFilingConsumer } from './service';
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
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [AnalyzeFilingConsumer],
})
export class FilingModule {}
