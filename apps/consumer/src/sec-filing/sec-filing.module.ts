import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ExternalApiModule } from '@libs/infrastructure/external-api';
import { PortfolioDomainModule } from '@libs/infrastructure/mongo';
import { BrowserModule } from '@libs/infrastructure/browser';
import { Analyze13fConsumer, Notify13fConsumer } from './service';

@Module({
  imports: [
    ExternalApiModule,
    BrowserModule,
    PortfolioDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_13F,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.NOTIFY_13F,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [Analyze13fConsumer, Notify13fConsumer],
})
export class SecFilingModule {}
