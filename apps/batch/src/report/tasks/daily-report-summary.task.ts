import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import {
  DebentureReport,
  DebentureReportRepository,
  EconomyReport,
  EconomyReportRepository,
  IndustryReport,
  IndustryReportRepository,
  InvestReport,
  InvestReportRepository,
  MarketInfoReport,
  MarketInfoReportRepository,
  ReportSummary,
  ReportSummaryRepository,
  StockReport,
  StockReportRepository,
} from '@libs/domain';
import { retry } from '@libs/common';
import { REPORT_SUMMARY_TYPE } from '@libs/domain';
import { OllamaService } from '@libs/ai';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';

@Injectable()
export class DailyReportSummaryTask {
  constructor(
    @InjectQueue(QUEUE_NAME.REPORT_SUMMARY)
    private readonly queue: Queue,
  ) {}

  async exec() {
    await this.queue.addBulk(
      new Array(10).fill({
        data: { date: format(new Date(), 'yyyy-MM-dd') },
        options: { removeOnComplete: true },
      }),
    );
  }
}
