import { Module } from '@nestjs/common';
import { ReportCrawlerCommand } from './commands';
import { InvestReportCrawlerTask } from './tasks';

@Module({
  providers: [ReportCrawlerCommand, InvestReportCrawlerTask],
})
export class ReportBatchModule {}
