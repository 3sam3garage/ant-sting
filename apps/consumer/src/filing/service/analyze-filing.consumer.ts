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

  // private ttlResolver(dateTime: Date) {
  //   return flow(
  //     addDays(1),
  //     startOfDay,
  //     (expiredAt) => expiredAt.getTime() - Date.now(),
  //     (ttl) => ttl / 1000,
  //     Math.ceil,
  //     Math.abs,
  //   )(dateTime);
  // }

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
    const {
      summaries,
      analysis: { score, reason },
    } = response;

    filing.analysis = FilingAnalysis.create({ summaries, score, reason });
    await this.filingRepository.save(filing);

    // 3점 이상인 항목은 5분마다 정기적으로 수집하도록 포함.
    // if (score >= 3) {
    //   await this.redis.sadd(TICKER_SNIPPETS_SET, filing.ticker);
    // }

    // 4점 이상인 항목은 슬랙 메시지 발송
    // if (score >= 4) {
    //   const exists = await this.redis.hexists(
    //     SLACK_MESSAGE_FILING_SET,
    //     filing.ticker,
    //   );
    //
    //   if (exists) {
    //     return;
    //   }
    //
    //   const slackMessage = fromSecFilingToSlackMessage(filing);
    //   await this.slackService.sendMessage(slackMessage);
    //   await this.redis.sadd(SLACK_MESSAGE_FILING_SET, filing.ticker);
    //   const ttl = this.ttlResolver(new Date());
    //   await this.redis.expire(SLACK_MESSAGE_FILING_SET, ttl);
    // }
  }
}
