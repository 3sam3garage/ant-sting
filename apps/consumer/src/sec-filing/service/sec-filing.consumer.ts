import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { AnalyzeSec13fMessage } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { FILING_SOURCE } from '@libs/core';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class SecFilingConsumer extends BaseConsumer {
  constructor() {
    super();
  }

  @Process({
    name: FILING_SOURCE.SEC_13F,
    concurrency: 1,
  })
  async run({ data }: Job<AnalyzeSec13fMessage>) {
    console.log(data);
  }
}
