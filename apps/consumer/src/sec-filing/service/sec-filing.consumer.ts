import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { AnalyzeSec13fMessage } from '@libs/domain-mongo';
import { QUEUE_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_13F)
export class SecFilingConsumer extends BaseConsumer {
  constructor() {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data }: Job<AnalyzeSec13fMessage>) {
    console.log(data);
  }
}
