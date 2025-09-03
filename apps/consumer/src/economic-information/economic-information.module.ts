import { Module } from '@nestjs/common';
import { EconomicInformationDomainModule } from '@libs/infrastructure/mongo';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/infrastructure/ai';
import { EconomicInformationConsumer } from './service';
import { ExternalApiModule } from '@libs/infrastructure/external-api';

@Module({
  imports: [
    EconomicInformationDomainModule,
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
