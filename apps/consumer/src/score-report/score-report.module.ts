import { Module } from '@nestjs/common';
import {
  MacroEnvironmentDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { MarketInfoReportConsumer, StockReportConsumer } from './service';

@Module({
  imports: [
    MacroEnvironmentDomainModule,
    StockReportDomainModule,
    AiModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.MACRO_ENVIRONMENT,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.STOCK_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
    ),
  ],
  providers: [MarketInfoReportConsumer, StockReportConsumer],
})
export class ScoreReportModule {}
