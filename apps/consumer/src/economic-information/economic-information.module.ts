import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { EconomicInformationConsumer } from './service';

@Module({
  imports: [
    EconomicInformationDomainModule,
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ECONOMIC_INFORMATION,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [EconomicInformationConsumer],
})
export class EconomicInformationModule {}
