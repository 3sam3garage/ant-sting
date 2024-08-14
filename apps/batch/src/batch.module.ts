import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FinancialStatementBatchModule } from './financial-statement';
import { ReportBatchModule } from './report';
import { TestBatchModule } from './test';
import { ReportSummaryBatchModule } from './report-summary';

@Module({
  imports: [
    CoreModule,
    TestBatchModule,
    FinancialStatementBatchModule,
    ReportBatchModule,
    ReportSummaryBatchModule,
  ],
})
export class BatchModule {}
