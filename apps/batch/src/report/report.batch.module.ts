import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { ReportCrawlerCommand } from './commands';
import { InvestReportCrawlerTask } from './tasks';

@Module({
  imports: [InvestReportDomainModule],
  providers: [ReportCrawlerCommand, InvestReportCrawlerTask],
})
export class ReportBatchModule {}
