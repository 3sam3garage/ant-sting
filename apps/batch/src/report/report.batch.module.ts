import { Module } from '@nestjs/common';
import { ReportCrawlerCommand } from './commands';
import { ReportCrawlerTask } from './tasks';

@Module({
  providers: [ReportCrawlerCommand, ReportCrawlerTask],
})
export class ReportBatchModule {}
