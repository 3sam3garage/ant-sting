import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ExternalApiModule } from '@libs/external-api';
import { SecFilingDomainModule } from '@libs/domain';
import { SecFilingConsumer } from './service';

@Module({
  imports: [
    ExternalApiModule,
    SecFilingDomainModule,
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
