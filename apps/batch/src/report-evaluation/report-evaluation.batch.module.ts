import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  InvestReportDomainModule,
  ReportSummaryDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { ReportEvaluationCommand } from './commands';
import { DailyInvestReportEvaluationTask } from './tasks';

@Module({
  imports: [
    InvestReportDomainModule,
    ReportSummaryDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.INVEST_REPORT_SCORE,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [ReportEvaluationCommand, DailyInvestReportEvaluationTask],
})
export class ReportEvaluationBatchModule {}
