import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { TestCommand } from './commands';
import { TestTask } from './tasks';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';

@Module({
  imports: [
    InvestReportDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.INVEST_REPORT_SCORE,
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        return { connection: config.getConfig() };
      },
    }),
  ],
  providers: [TestCommand, TestTask],
})
export class TestBatchModule {}
