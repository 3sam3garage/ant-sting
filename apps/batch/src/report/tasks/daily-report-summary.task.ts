import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from '@libs/config';

@Injectable()
export class DailyReportSummaryTask {
  constructor(
    @InjectQueue(QUEUE_NAME.REPORT_SUMMARY)
    private readonly queue: Queue,
  ) {}

  async exec() {
    await this.queue.addBulk(
      new Array(5).fill({
        data: { date: format(new Date(), 'yyyy-MM-dd') },
        options: { removeOnComplete: true },
      }),
    );
  }
}
