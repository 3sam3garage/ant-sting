import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FinancialStatementBatchModule } from './financial-statement';
import { ReportBatchModule } from './report';

@Module({
  imports: [CoreModule, FinancialStatementBatchModule, ReportBatchModule],
})
export class BatchModule {}
