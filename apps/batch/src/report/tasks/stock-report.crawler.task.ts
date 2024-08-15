import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from '@libs/config';
import { eucKR2utf8, formatSixDigitDate, joinUrl } from '@libs/common';
import {
  StockReport as StockReportEntity,
  StockReportRepository,
} from '@libs/domain';
import { N_PAY_RESEARCH, REQUEST_HEADERS } from '../constants';
import { StockReport } from '../interface';
import { figureNid } from '../utils';

@Injectable()
export class StockReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH, 'company_list.naver');

  constructor(
    private readonly stockReportRepo: StockReportRepository,
    @InjectQueue(QUEUE_NAME.STOCK_REPORT_SCORE)
    private readonly queue: Queue,
  ) {}

  private figureCode(url: string) {
    const matched = url.match(/code=(\d+)/);
    if (!matched) {
      throw new Error('Cannot figure out code from url');
    }

    return matched[1];
  }

  async exec() {
    const response = await axios.get(this.URL, {
      headers: { ...REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    const text = eucKR2utf8(response.data);
    const html = parseToHTML(text);

    const rows = html
      .querySelectorAll('#contentarea_left > div.box_type_m > table.type_1 tr')
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
        code: this.figureCode(itemUrl),
        title: titleAnchor.innerText.trim(),
        nid: figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const stockReport of stockReports) {
      let report = await this.stockReportRepo.findOneByNid(stockReport.nid);
      if (report) {
        await this.stockReportRepo.updateOne(report, stockReport);
      } else {
        const entity = StockReportEntity.create(stockReport);
        report = await this.stockReportRepo.createOne(entity);
      }

      const _id = report._id.toString();
      await this.queue.add(
        { _id },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
  }
}
