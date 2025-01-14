import { Redis } from 'ioredis';
import { Inject, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ObjectId } from 'mongodb';
import { isBefore, subMonths } from 'date-fns';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { ANALYZE_SEC_DOCUMENT_PROMPT, ClaudeService } from '@libs/ai';
import {
  FilingAnalysis,
  FilingRepository,
  SEC_FILING_URL_SET,
} from '@libs/domain';
import { SecApiService } from '@libs/external-api';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_FILING)
export class AnalyzeFilingConsumer extends BaseConsumer {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
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

    switch (true) {
      case !!filing.analysis:
        Logger.debug('Filing already analyzed');
        return;
      case isBefore(new Date(filing.date), subMonths(new Date(), 1)):
        Logger.debug('Filing passed 1 month.');
        return;
    }

    const document = await this.secApiService.fetchFilingDocument(filing.url);
    const prompt = ANALYZE_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      document,
    );

    const response = await this.claudeService.invoke(prompt);
    const {
      summaries,
      analysis: { score, reason },
    } = response;

    filing.analysis = FilingAnalysis.create({ summaries, score, reason });
    await this.filingRepository.save(filing);
    await this.redis.sadd(SEC_FILING_URL_SET, filing.url);
  }
}
