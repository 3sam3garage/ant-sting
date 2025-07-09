import { Job } from 'bull';
import { ObjectId } from 'mongodb';
import { Process, Processor } from '@nestjs/bull';
import {
  AnalyzeSec13fMessage,
  SecCompanyRepository,
  SecFilingRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { FILING_SOURCE } from '@libs/core';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class SecFilingConsumer extends BaseConsumer {
  constructor(
    private readonly secFilingRepo: SecFilingRepository,
    private readonly secCompanyRepo: SecCompanyRepository,
  ) {
    super();
  }

  @Process({
    name: FILING_SOURCE.SEC_13F,
    concurrency: 1,
  })
  async run({ data }: Job<AnalyzeSec13fMessage>) {
    const filing = await this.secFilingRepo.findOne({
      where: { _id: new ObjectId(data?.filingId) },
    });

    if (!filing) {
      return;
    }

    console.log(data);
  }
}
