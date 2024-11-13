import { Module } from '@nestjs/common';
import {
  MacroEnvironmentDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { MarketInfoReportConsumer } from './service';

@Module({
  imports: [
    MacroEnvironmentDomainModule,
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.MACRO_ENVIRONMENT,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [MarketInfoReportConsumer],
})
export class MacroEnvironmentModule {}
