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
import { figureNid } from '../utils';

@Injectable()
export class ScrapeStockReportsCrawler {
  private readonly URL = joinUrl(N_PAY_RESEARCH_URL, 'company_list.naver');

  constructor(
    private readonly stockReportRepo: StockReportRepository,
    @InjectQueue(QUEUE_NAME.STOCK_REPORT_DETAIL)
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

        const [stockName, , stockFirm, date, views] = cells.map((cell) =>
          cell.innerText.trim(),
        );
        const anchor = row.querySelector('td.file > a');
        const detailUrl = titleAnchor.getAttribute('href');
        const itemUrl = itemAnchor.getAttribute('href');

        const entity = StockReportEntity.create({
          stockName,
          code: this.figureStockCode(itemUrl),
          title: titleAnchor.innerText.trim(),
          uuid: figureNid(detailUrl),
          detailUrl,
          stockFirm,
          date: formatSixDigitDate(date),
          views,
          file: anchor?.getAttribute('href'),
        });
        stockReports.push(entity);

        for (const stockReport of stockReports) {
          let report = await this.stockReportRepo.findOneByUid(
            stockReport.uuid,
          );

          if (report) {
            await this.stockReportRepo.save({ ...report, ...stockReport });
          } else {
            report = await this.stockReportRepo.save(entity);
          }

          await this.queue.add(
            { stockReportId: report._id.toString() },
            { removeOnComplete: true, removeOnFail: true },
          );
        }
      }
    }
  }
}
