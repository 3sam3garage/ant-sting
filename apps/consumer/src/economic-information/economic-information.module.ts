import { Module } from '@nestjs/common';
import { EconomicInformationMongoModule } from '@libs/infrastructure/mongo';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/shared/config';
import { AiModule } from '@libs/infrastructure/ai';
import { EconomicInformationConsumer } from './service';
import { ExternalApiModule } from '@libs/infrastructure/external-api';

@Module({
  imports: [
    EconomicInformationMongoModule,
    AiModule,
    ExternalApiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ECONOMIC_INFORMATION,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [EconomicInformationConsumer],
})
export class EconomicInformationModule {}
