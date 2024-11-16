import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { TestCommand } from './commands';
import { TestTask } from './tasks';

@Module({
  imports: [
    AiModule,
    EconomicInformationDomainModule,
    StockReportDomainModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.STOCK_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.ECONOMIC_INFORMATION,
        inject: [RedisConfigService],
        useFactory: async (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
    ),
  ],
  providers: [TestCommand, TestTask],
})
export class TestBatchModule {}
