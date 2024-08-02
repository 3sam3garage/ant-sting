import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { FinancialStatementCrawlerCommand } from './commands';
import { FinancialStatementCrawlerTask } from './tasks';

@Module({
  imports: [InvestReportDomainModule],
  providers: [FinancialStatementCrawlerCommand, FinancialStatementCrawlerTask],
})
export class FinancialStatementBatchModule {}
