import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME } from '@libs/config';
import { ClaudeService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_FILING)
export class AnalyzeFilingConsumer extends BaseConsumer {
  constructor(private readonly claudeService: ClaudeService) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { filingId } }: Job<{ filingId: string }>) {
    console.log(filingId);
  }
}
