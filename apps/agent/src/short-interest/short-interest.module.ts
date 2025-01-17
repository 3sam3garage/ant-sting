import { Module } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { TickerDomainModule } from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';
import { FetchProxyJob } from './jobs';
import { BullModule } from '@nestjs/bull';
import { RealtimeShortScrapeJob } from './jobs/realtime-short-scrape.job';

@Module({
  imports: [
    TickerDomainModule,
    ExternalApiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.SCRAPE_REALTIME_SHORT,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [
    FetchProxyJob,
    RealtimeShortScrapeJob,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class ShortInterestModule {}
