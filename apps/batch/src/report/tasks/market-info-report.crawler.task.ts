import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { eucKR2utf8, formatSixDigitDate, joinUrl } from '@libs/common';
import { N_PAY_RESEARCH, REQUEST_HEADERS } from '../constants';
import { InvestReport, MarketInfoReport } from '../interface';
import { figureNid } from '../utils';

@Injectable()
export class MarketInfoReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH, 'market_info_list.naver');

  constructor() {} // @InjectQueue(QUEUE_NAME.INVEST_REPORT_SCORE) private readonly queue: Queue, // private readonly investReportRepo: InvestReportRepository,

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

    const marketInfoReports: MarketInfoReport[] = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td:not(.file)');
      const titleAnchor = cells.shift().querySelector('a');
      const [stockFirm, date, views] = cells.map((cell) =>
        cell.innerText.trim(),
      );
      const anchor = row.querySelector('td.file > a');
      const detailUrl = titleAnchor.getAttribute('href');

      marketInfoReports.push({
        title: titleAnchor.innerHTML.trim(),
        nid: figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }
  }
}
