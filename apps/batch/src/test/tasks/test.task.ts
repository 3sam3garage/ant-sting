import { Injectable } from '@nestjs/common';
import { StockReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TestTask {
  constructor(
    private readonly repo: StockReportRepository,
    @InjectQueue(QUEUE_NAME.STOCK_REPORT_SCORE) private readonly queue: Queue,
  ) {}

  async exec(): Promise<void> {
    const reports = await this.repo.find();
    for (const report of reports) {
      // await this.queue.add(
      //   { _id: report._id.toString() },
      //   { removeOnFail: true, removeOnComplete: true, attempts: 3 },
      // );

      if (!report?.recommendation?.disparateRatio) {
        const { price, targetPrice, position } = report?.recommendation || {};

        if (price && targetPrice) {
          report.addRecommendation({
            price: price.toString(),
            targetPrice: targetPrice.toString(),
            position,
          });
        }

        await this.repo.save(report);
      }
    }
  }
}
