import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ObjectId } from 'mongodb';
import { QUEUE_NAME } from '@libs/config';
import { ClaudeService } from '@libs/ai';
import { FilingRepository } from '@libs/domain';
import { SecApiService } from '@libs/external-api';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_FILING)
export class AnalyzeFilingConsumer extends BaseConsumer {
  constructor(
    private readonly claudeService: ClaudeService,
    private readonly filingRepository: FilingRepository,
    private readonly secApiService: SecApiService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { filingId } }: Job<{ filingId: string }>) {
    const filing = await this.filingRepository.findOne({
      where: { _id: new ObjectId(filingId) },
    });

    const document = await this.secApiService.fetchFilingDocument(filing.url);
    console.log(document);
  }
}
