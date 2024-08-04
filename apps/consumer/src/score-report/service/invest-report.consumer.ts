import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InvestReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Processor(QUEUE_NAME.INVEST_REPORT_SCORE)
export class InvestReportConsumer extends BaseConsumer {
  constructor(private readonly investReportRepo: InvestReportRepository) {
    super();
  }

  @Process()
  async run({ data }: Job) {
    const investReport = await this.investReportRepo.findOneById(
      new ObjectId(data.id),
    );
    Logger.log(investReport.title);

    // 1. 페이지에 간다.
    // 2. 페이지 요약 정보를 가져온다.
  }
}
