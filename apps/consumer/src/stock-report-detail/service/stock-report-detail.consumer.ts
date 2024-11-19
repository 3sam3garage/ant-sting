import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ObjectId } from 'mongodb';
import {
  MARKET_POSITION,
  N_PAY_RESEARCH_URL,
  StockReportRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { ClaudeService } from '@libs/ai';
import { joinUrl, requestAndParseEucKr } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.STOCK_REPORT_DETAIL)
export class StockReportDetailConsumer extends BaseConsumer {
  private FIRMS_TO_EXCLUDE = [
    '나이스디앤비',
    '한국기술신용평가(주)',
    '한국IR협의회',
  ];

  constructor(
    private readonly repo: StockReportRepository,
    private readonly claudeService: ClaudeService,
    @InjectQueue(QUEUE_NAME.ANALYZE_STOCK)
    private readonly queue: Queue,
  ) {
    super();
  }

  private parsePosition(text: string): MARKET_POSITION {
    const item = text?.toLowerCase();
    switch (true) {
      case item?.includes('buy'):
      case item?.includes('maintain'):
      case item?.includes('매수'):
      case item?.includes('유지'):
        return MARKET_POSITION.BUY;
      case item?.includes('sell'):
      case item?.includes('매도'):
        return MARKET_POSITION.SELL;
      case item?.includes('nr'):
      case item?.includes('hold'):
      case item?.includes('neutral'):
      case item?.includes('not rated'):
      case item?.includes('Not Rated'):
      case item?.includes('보유'):
      case item?.includes('없음'):
      case item?.includes('-'):
      default:
        return MARKET_POSITION.HOLD;
    }
  }

  @Process({ concurrency: 1 })
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

      const valuesToUpdate = {
        summary:
          html.querySelector('table.type_1 td.view_cnt')?.innerText || '',
        targetPrice: +html.querySelector('em.money').innerText || 0,
        position:
          this.parsePosition(html.querySelector('em.coment')?.innerText) ||
          MARKET_POSITION.HOLD,
      };

      await this.repo.save({ report, ...valuesToUpdate });
    }

    await this.queue.add({ _id: data._id });
  }
}
