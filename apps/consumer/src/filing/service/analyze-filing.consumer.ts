import { parse as parseHTML } from 'node-html-parser';
import { Redis } from 'ioredis';
import { Inject, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ObjectId } from 'mongodb';
import { isBefore, subMonths } from 'date-fns';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT, GeminiService } from '@libs/ai';
import {
  FilingAnalysis,
  FilingRepository,
  FILINGS_TO_ANALYZE,
} from '@libs/domain';
import { SecApiService, SlackService } from '@libs/external-api';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_FILING)
export class AnalyzeFilingConsumer extends BaseConsumer {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly geminiService: GeminiService,
    private readonly filingRepository: FilingRepository,
    private readonly secApiService: SecApiService,
    private readonly slackService: SlackService,
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
      case !FILINGS_TO_ANALYZE.includes(filing.formType):
        Logger.debug('Filing is not 8-K');
        return;
      case !filing.url.includes('8k'):
        Logger.debug('8-K, but common filing');
        return;
    }

    const document = await this.secApiService.fetchFilingDocument(filing.url);
    const html = parseHTML(document);
    const body = html.querySelector('body');

    const content = body?.innerHTML ? body?.innerHTML : html?.innerHTML;

    const prompt = ANALYZE_GEMMA_SEC_DOCUMENT_PROMPT.replace(
      '{{SEC_FILING}}',
      content,
    );
    const response = await this.geminiService.invoke({ contents: prompt });
    console.log(response);
    const {
      summaries,
      analysis: { score, reason },
    } = response;

    filing.analysis = FilingAnalysis.create({ summaries, score, reason });
    await this.filingRepository.save(filing);
  }
}
