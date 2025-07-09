import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { SecFilingRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import { FILING_SOURCE } from '@libs/core/constants';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class SecFilingConsumer extends BaseConsumer {
  constructor(private readonly repo: SecFilingRepository) {
    super();
  }

  @Process({
    name: FILING_SOURCE.SEC_13F,
    concurrency: 1,
  })
  async naver({ data }: Job<unknown>) {}
}
