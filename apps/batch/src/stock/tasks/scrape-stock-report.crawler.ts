import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from '@libs/config';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import {
  N_PAY_RESEARCH_URL,
  StockReport as StockReportEntity,
  StockReportRepository,
} from '@libs/domain';
import { StockReport } from '../interface';
import { figureNid } from '../utils';

@Injectable()
export class ScrapeStockReportCrawler {
  private readonly URL = joinUrl(N_PAY_RESEARCH_URL, 'company_list.naver');

  constructor(
    private readonly stockReportRepo: StockReportRepository,
    @InjectQueue(QUEUE_NAME.STOCK_REPORT_SUMMARY)
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

      const stockReports: StockReport[] = [];
      for (const row of rows) {
        const cells = row.querySelectorAll('td:not(.file)');
        const [itemAnchor, titleAnchor] = row.querySelectorAll('td > a');

        const [stockName, , stockFirm, date, views] = cells.map((cell) =>
          cell.innerText.trim(),
        );
        const anchor = row.querySelector('td.file > a');
        const detailUrl = titleAnchor.getAttribute('href');
        const itemUrl = itemAnchor.getAttribute('href');

        stockReports.push({
          stockName,
          code: this.figureStockCode(itemUrl),
          title: titleAnchor.innerText.trim(),
          nid: figureNid(detailUrl),
          detailUrl,
          stockFirm,
          date: formatSixDigitDate(date),
          views,
          file: anchor?.getAttribute('href'),
        });
      }

      for (const stockReport of stockReports) {
        let report = await this.stockReportRepo.findOneByNid(stockReport.nid);

        if (report) {
          await this.stockReportRepo.save({ ...report, ...stockReport });
        } else {
          const entity = StockReportEntity.create(stockReport);
          report = await this.stockReportRepo.save(entity);
        }

        const _id = report._id.toString();
        await this.queue.addBulk(
          new Array(1).fill({
            data: { _id },
            opts: { removeOnComplete: true, removeOnFail: true },
          }),
        );
      }
    }
  }
}
