import { Module } from '@nestjs/common';
import { FinancialStatementBatchModule } from './financial-statement';

@Module({
  imports: [FinancialStatementBatchModule],
})
export class BatchModule {}
