import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { StockReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';

@Injectable()
export class ReportSummaryTask {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(
    private readonly repo: StockReportRepository,
    @InjectQueue(QUEUE_NAME.STOCK_REPORT_SCORE) private readonly queue: Queue,
  ) {}

  async exec(): Promise<void> {
    const reports = await this.repo.find();
    for (const report of reports) {
      await this.queue.add(
        { _id: report._id.toString() },
        { removeOnFail: true, removeOnComplete: true, attempts: 3 },
      );
    }
  }
}
