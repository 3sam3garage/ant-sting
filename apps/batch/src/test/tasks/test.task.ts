import { Injectable } from '@nestjs/common';
import { InvestReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TestTask {
  constructor(
    private readonly repo: InvestReportRepository,
    @InjectQueue(QUEUE_NAME.INVEST_REPORT_SCORE)
    private readonly queue: Queue,
  ) {}

  async exec(): Promise<void> {
    const items = await this.repo.find({ take: 30 });

    for (const item of items) {
      const id = item._id.toString();
      await this.queue.add(id, { jobId: id });
    }
  }
}
