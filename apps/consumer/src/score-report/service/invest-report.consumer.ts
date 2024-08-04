import { Processor } from '@nestjs/bullmq';
import { Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InvestReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_NAME.INVEST_REPORT_SCORE)
export class InvestReportConsumer extends BaseConsumer {
  constructor(private readonly investReportRepo: InvestReportRepository) {
    super();
  }

  @Process()
  async run({ data }: Job) {
    const investReport = await this.investReportRepo.findOneById(data.id);
    Logger.log(investReport);
  }
}
