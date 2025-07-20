import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ExternalApiModule } from '@libs/external-api';
import {
  SecCompanyDomainModule,
  SecFilingDomainModule,
} from '@libs/domain-mongo';
import { SecFilingConsumer } from './service';

@Module({
  imports: [
    ExternalApiModule,
    SecFilingDomainModule,
    SecCompanyDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_13F,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [SecFilingConsumer],
})
export class SecFilingModule {}
