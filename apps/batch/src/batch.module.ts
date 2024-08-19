import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FinancialStatementBatchModule } from './financial-statement';
import { ReportBatchModule } from './report';
import { TestBatchModule } from './test';

@Module({
  imports: [
    CoreModule,
    TestBatchModule,
    FinancialStatementBatchModule,
    ReportBatchModule,
  ],
})
export class BatchModule {}
