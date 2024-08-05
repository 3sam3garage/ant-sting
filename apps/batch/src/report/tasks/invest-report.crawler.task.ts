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
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';

@Injectable()
export class InvestReportCrawlerTask {
  private readonly N_PAY_RESEARCH =
    'https://finance.naver.com/research/invest_list.naver';

  constructor(
    private readonly investReportRepo: InvestReportRepository,
    @InjectQueue(QUEUE_NAME.INVEST_REPORT_SCORE) private readonly queue: Queue,
  ) {}

  private figureNid(link: string): string {
    const [, params] = link.split('?');
    const queries = params.split('&');

    for (const query of queries) {
      if (query.includes('nid')) {
        const [, value] = query.split('=');
        return value?.trim();
      }
    }

    return '';
  }

  async exec() {
    const response = await axios.get(`${this.N_PAY_RESEARCH}?&page=2`, {
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
      const detailUrl = titleAnchor.getAttribute('href');

      investReports.push({
        title: titleAnchor.innerHTML.trim(),
        nid: this.figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const report of investReports) {
      let investReport = await this.investReportRepo.findOneByNid(report.nid);
      if (investReport) {
        await this.investReportRepo.updateOne(investReport, report);
      } else {
        const entity = InvestReportEntity.create(report);
        investReport = await this.investReportRepo.createOne(entity);
      }

      const _id = investReport._id.toString();
      await this.queue.add(
        { _id },
        { jobId: _id, removeOnComplete: true, removeOnFail: true },
      );
    }
  }
}
