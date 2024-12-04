import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from '@libs/config';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import {
  MARKET_TYPE,
  N_PAY_BASE_URL,
  StockReport as StockReportEntity,
  StockReportRepository,
} from '@libs/domain';
import { figureNid } from '../utils';

@Injectable()
export class NaverStockReportsCrawler {
  private readonly URL = joinUrl(N_PAY_BASE_URL, 'research/company_list.naver');
  private FIRMS_TO_EXCLUDE = [
    '나이스디앤비',
    '한국기술신용평가(주)',
    '한국IR협의회',
  ];

  constructor(
    private readonly stockReportRepo: StockReportRepository,
    @InjectQueue(QUEUE_NAME.ANALYZE_STOCK)
    private readonly queue: Queue,
  ) {}

  private figureStockCode(url: string) {
    const matched = url.match(/code=(\d+)/);
    if (!matched) {
      throw new Error('Cannot figure out code from url');
    }

    return matched[1];
  }

  async exec() {
    for (let i = 1; i <= 1; i++) {
      const html = await requestAndParseEucKr(this.URL, { page: i });

      const rows = html
        .querySelectorAll(
          '#contentarea_left > div.box_type_m > table.type_1 tr',
        )
        .filter((row) => row.querySelector('td.file'));

      const stockReports: StockReportEntity[] = [];
      for (const row of rows) {
        const cells = row.querySelectorAll('td:not(.file)');
        const [itemAnchor, titleAnchor] = row.querySelectorAll('td > a');

        const [stockName, , stockFirm, date] = cells.map((cell) =>
          cell.innerText.trim(),
        );
        const anchor = row.querySelector('td.file > a');
        const detailUrl = titleAnchor.getAttribute('href');
        const itemUrl = itemAnchor.getAttribute('href');

        if (this.FIRMS_TO_EXCLUDE.includes(stockFirm)) {
          Logger.debug('Excluding stock firm:', stockFirm);
          continue;
        }

        const entity = StockReportEntity.create({
          stockName,
          code: this.figureStockCode(itemUrl),
          title: titleAnchor.innerText.trim(),
          uuid: `naver:${figureNid(detailUrl)}`,
          // detailUrl,
          stockFirm,
          date: formatSixDigitDate(date),
          // views,
          file: anchor?.getAttribute('href'),
          market: MARKET_TYPE.KR,
        });
        stockReports.push(entity);
      }

      for (const stockReport of stockReports) {
        const foundReport = await this.stockReportRepo.findOneByUid(
          stockReport.uuid,
        );
        if (foundReport) {
          Logger.debug('Report Already exists:', stockReport.uuid);
          continue;
        }

        const result = await this.stockReportRepo.save(stockReport);
        await this.queue.add(
          { stockReportId: result._id.toString() },
          { removeOnComplete: true, removeOnFail: true },
        );
      }
    }
  }
}
