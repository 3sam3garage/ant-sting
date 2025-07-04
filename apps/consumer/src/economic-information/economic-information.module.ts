import { Module } from '@nestjs/common';
import { EconomicInformationDomainModule } from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { EconomicInformationConsumer } from './service';

@Module({
  imports: [
    EconomicInformationDomainModule,
    AiModule,
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
