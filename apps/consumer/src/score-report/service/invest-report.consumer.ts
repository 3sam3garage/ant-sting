import { Processor } from '@nestjs/bullmq';
import { Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME } from '../constants';
import { BaseConsumer } from '../../base.consumer';
import { InvestReportRepository } from '@libs/domain';

@Processor(QUEUE_NAME.INVEST_REPORT_SUMMARY)
export class InvestReportConsumer extends BaseConsumer {
  constructor(private readonly investReportRepo: InvestReportRepository) {
    super();
  }

  @Process()
  async run({ data }: Job) {
    console.log(data);

    const investReport = await this.investReportRepo.findOneById(data.id);
    console.log(investReport);
  }
}
