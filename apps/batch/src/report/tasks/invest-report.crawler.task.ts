import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { Injectable } from '@nestjs/common';
import { eucKR2utf8, formatSixDigitDate } from '@libs/common';
import { REQUEST_HEADERS } from '../constants';
import { InvestReport } from '../interface';
import {
  InvestReportRepository,
  InvestReport as InvestReportEntity,
} from '@libs/domain';

@Injectable()
export class InvestReportCrawlerTask {
  private readonly N_PAY_RESEARCH =
    'https://finance.naver.com/research/invest_list.naver';

  constructor(private readonly investReportRepo: InvestReportRepository) {}

  async exec() {
    const response = await axios.get(`${this.N_PAY_RESEARCH}?&page=3`, {
      headers: { ...REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    const text = eucKR2utf8(response.data);
    const html = parseToHTML(text);

    const rows = html
      .querySelectorAll('#contentarea_left > div.box_type_m > table.type_1 tr')
      .filter((row) => row.querySelector('td.file'));

    const investReports: InvestReport[] = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td:not(.file)');
      const titleAnchor = cells.shift().querySelector('a');
      const [stockFirm, date, views] = cells.map((cell) =>
        cell.innerText.trim(),
      );
      const anchor = row.querySelector('td.file > a');

      investReports.push({
        title: titleAnchor.innerHTML.trim(),
        detailUrl: titleAnchor.getAttribute('href'),
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const report of investReports) {
      const entity = InvestReportEntity.create(report);
      await this.investReportRepo.createOne(entity);
    }
  }
}
