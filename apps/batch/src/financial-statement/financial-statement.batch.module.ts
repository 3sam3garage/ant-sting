import { Module } from '@nestjs/common';
import { FinancialStatementCrawlerCommand } from './commands';
import { FinancialStatementCrawlerTask } from './tasks';

@Module({
  providers: [FinancialStatementCrawlerCommand, FinancialStatementCrawlerTask],
})
export class FinancialStatementBatchModule {}
