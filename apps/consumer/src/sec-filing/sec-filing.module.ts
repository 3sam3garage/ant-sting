import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ExternalApiModule } from '@libs/external-api';
import {
  PortfolioDomainModule,
  SecCompanyDomainModule,
  SecFilingDomainModule,
} from '@libs/mongo';
import { Analyze13fConsumer, Notify13fConsumer } from './service';
import { BrowserModule } from '@libs/browser';

@Module({
  imports: [
    ExternalApiModule,
    SecFilingDomainModule,
    SecCompanyDomainModule,
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
