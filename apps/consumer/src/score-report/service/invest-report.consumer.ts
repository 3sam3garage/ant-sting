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
  async run({ data }: Job<{ _id: string }>) {
    const investReport = await this.investReportRepo.findOneById(
      new ObjectId(data._id),
    );
    Logger.log(investReport.title);

    // 1. 페이지에 간다.
    // 2. 페이지 요약 정보를 가져온다.
    // 3. ai 요청을 날린다.
    // 4. 요약 정보와 ai 요청 결과를 DB에 저장한다.
  }
}
