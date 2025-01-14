import { Module } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { UpdateFilingJob, ScrapeRssJob } from './jobs';
import { FilingDomainModule, TickerDomainModule } from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';

@Module({
  imports: [
    TickerDomainModule,
    FilingDomainModule,
    ExternalApiModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.FETCH_FILING,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
      {
        name: QUEUE_NAME.ANALYZE_FILING,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getCommonConfig() };
        },
      },
    ),
  ],
  providers: [
    UpdateFilingJob,
    ScrapeRssJob,
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
