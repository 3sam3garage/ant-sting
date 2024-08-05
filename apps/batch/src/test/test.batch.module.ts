import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { TestCommand } from './commands';
import { ReportSummaryTask, TestTask } from './tasks';

@Module({
  imports: [
    InvestReportDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.INVEST_REPORT_SCORE,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [TestCommand, TestTask, ReportSummaryTask],
})
export class TestBatchModule {}
