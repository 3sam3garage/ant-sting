import { Module } from '@nestjs/common';
import { TickerDomainModule } from '@libs/domain';
import { RealtimeShortInterestConsumer } from './service';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TickerDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.SCRAPE_REALTIME_SHORT,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [
    RealtimeShortInterestConsumer,
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
