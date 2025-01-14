import { Module } from '@nestjs/common';
import { AiModule } from '@libs/ai';
import { AnalyzeFilingConsumer, FetchFilingConsumer } from './service';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { FilingDomainModule, TickerDomainModule } from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    AiModule,
    TickerDomainModule,
    FilingDomainModule,
    ExternalApiModule,
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
  providers: [
    AnalyzeFilingConsumer,
    FetchFilingConsumer,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class FilingModule {}
