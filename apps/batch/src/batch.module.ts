import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FinancialStatementBatchModule } from './financial-statement';
import { ReportBatchModule } from './report';
import { TestBatchModule } from './test';
import { ReportEvaluationBatchModule } from './report-evaluation';

@Module({
  imports: [
    CoreModule,
    TestBatchModule,
    FinancialStatementBatchModule,
    ReportBatchModule,
    ReportEvaluationBatchModule,
  ],
})
export class BatchModule {}
