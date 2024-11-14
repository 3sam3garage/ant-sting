import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { N_PAY_RESEARCH_URL, StockReportRepository } from '@libs/domain';
import { ExternalApiConfigService, QUEUE_NAME } from '@libs/config';
import { ClaudeService } from '@libs/ai';
import { joinUrl, omitIsNil, requestAndParseEucKr, retry } from '@libs/common';
import {
  BASE_SCORE_PROMPT,
  BASE_SYSTEM_PROMPT,
  CONSERVATIVE_VIEWER_SYSTEM_PROMPT,
  OPTIMISTIC_VIEWER_SYSTEM_PROMPT,
  PESSIMISTIC_VIEWER_SYSTEM_PROMPT,
} from '@libs/ai/claude.constant';
import { BaseConsumer } from '../../base.consumer';
import { GOV_STOCK_INFO_URL } from '../constants';

@Processor(QUEUE_NAME.STOCK_REPORT_SCORE)
export class StockReportConsumer extends BaseConsumer {
  private FIRMS_TO_EXCLUDE = [
    '나이스디앤비',
    '한국기술신용평가(주)',
    '한국IR협의회',
  ];

  constructor(
    private readonly repo: StockReportRepository,
    private readonly claudeService: ClaudeService,
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {
    super();
  }

  private parsePosition(text: string) {
    const item = text?.toLowerCase();
    switch (true) {
      case item?.includes('buy'):
      case item?.includes('매수'):
      case item?.includes('유지'):
      case item?.includes('보유'):
      case item?.includes('maintain'):
        return 'BUY';
      case item?.includes('sell'):
      case item?.includes('매도'):
        return 'SELL';
      case item?.includes('nr'):
      case item?.includes('NR'):
      case item?.includes('NEUTRAL'):
      case item?.includes('Neutral'):
      case item?.includes('not rated'):
      case item?.includes('Not Rated'):
      case item?.includes('없음'):
        return 'NEUTRAL';
    }

    return text;
  }

  @Process({ concurrency: 2 })
  async run({ data }: Job<{ _id: string }>) {
    const report = await this.repo.findOneById(new ObjectId(data._id));
    // 개별 리포트 정보가 아닌 뭉태기로 묶어오는 리포트면 건너뛰기 - 특정 증권사들
    if (this.FIRMS_TO_EXCLUDE.includes(report.stockFirm)) {
      return;
    }

    if (!report.summary) {
      const html = await requestAndParseEucKr(
        joinUrl(N_PAY_RESEARCH_URL, report.detailUrl),
      );

      report.summary =
        html.querySelector('table.type_1 td.view_cnt')?.innerText || '';

      const params = omitIsNil({
        serviceKey: this.externalApiConfigService.dataGoServiceKey,
        resultType: 'json',
        numOfRows: 1,
        itmsNm: report.stockName.trim(),
        basDt: null,
      });
      const stockInfo = await retry(
        () => axios.get(GOV_STOCK_INFO_URL, { params }),
        3,
      );
      const [item] = stockInfo.data.response.body.items.item;

      report.addRecommendation({
        targetPrice: html.querySelector('em.money').innerText,
        price: item?.mkp || 0,
        position: this.parsePosition(
          html.querySelector('em.coment')?.innerText || '',
        ),
      });

      await this.repo.save(report);
    }

    if (!report.summary) {
      Logger.debug('no summary exists');
      return;
    }

    const tasks = await Promise.all([
      this.claudeService.invoke(
        BASE_SCORE_PROMPT.replace('{{INFORMATION}}', report.summary),
        BASE_SYSTEM_PROMPT + OPTIMISTIC_VIEWER_SYSTEM_PROMPT,
      ),
      this.claudeService.invoke(
        BASE_SCORE_PROMPT.replace('{{INFORMATION}}', report.summary),
        BASE_SYSTEM_PROMPT + PESSIMISTIC_VIEWER_SYSTEM_PROMPT,
      ),
      this.claudeService.invoke(
        BASE_SCORE_PROMPT.replace('{{INFORMATION}}', report.summary),
        BASE_SYSTEM_PROMPT + CONSERVATIVE_VIEWER_SYSTEM_PROMPT,
      ),
    ]);

    for (const { reason, score } of tasks) {
      report.addScore({ reason, score: +score });
    }

    await this.repo.save(report);
  }
}
