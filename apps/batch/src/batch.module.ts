import { Module } from '@nestjs/common';
import { FinancialStatementBatchModule } from './financial-statement';
import { ReportBatchModule } from './report';

@Module({
  imports: [FinancialStatementBatchModule, ReportBatchModule],
})
export class BatchModule {}
