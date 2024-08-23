import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { format } from 'date-fns';
import { StockReportRepository } from '@libs/domain';
import { ExternalApiConfigService, QUEUE_NAME } from '@libs/config';
import { OllamaService } from '@libs/ai';
import { joinUrl, omitIsNil, requestAndParseEucKr, retry } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.STOCK_REPORT_SCORE)
export class StockReportConsumer extends BaseConsumer {
  private readonly N_PAY_BASE_URL = 'https://finance.naver.com/research';
  private readonly GOV_STOCK_INFO_URL =
    'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';
  private FIRMS_TO_EXCLUDE = [
    '나이스디앤비',
    '한국기술신용평가(주)',
    '한국IR협의회',
  ];

  constructor(
    private readonly repo: StockReportRepository,
    private readonly ollamaService: OllamaService,
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
      case item?.includes('not rated'):
      case item?.includes('Not Rated'):
      case item?.includes('없음'):
        return 'NR';
    }

    return text;
  }

  @Process({ concurrency: 3 })
  async run({ data }: Job<{ _id: string }>) {
    const report = await this.repo.findOneById(new ObjectId(data._id));
    // 개별 리포트 정보가 아닌 뭉태기로 묶어오는 리포트면 건너뛰기
    if (this.FIRMS_TO_EXCLUDE.includes(report.stockFirm)) {
      return;
    }

    if (!report.summary) {
      const html = await requestAndParseEucKr(
        joinUrl(this.N_PAY_BASE_URL, report.detailUrl),
      );

      report.summary = html
        .querySelectorAll('table td.view_cnt p')
        .map((item) => item?.innerText?.trim())
        .join('\n');

      const params = omitIsNil({
        serviceKey: this.externalApiConfigService.dataGoServiceKey,
        resultType: 'json',
        numOfRows: 1,
        itmsNm: report.stockName.trim(),
        basDt:
          format(new Date(), 'yyyy-MM-dd') === report.date
            ? null
            : report.date.replaceAll(/\-/g, ''),
      });
      const stockInfo = await retry(
        () => axios.get(this.GOV_STOCK_INFO_URL, { params }),
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

    // try {
    //   const { reason, score } = await this.ollamaService.scoreSummary(
    //     report.summary,
    //   );
    //
    //   report.addScore({ reason, score: +score });
    //   await this.repo.save(report);
    // } catch (e) {
    //   Logger.error(e);
    // }
  }
}
