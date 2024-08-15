import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import {
  InvestReportRepository,
  InvestReport as InvestReportEntity,
} from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAME } from '@libs/config';
import { eucKR2utf8, formatSixDigitDate, joinUrl } from '@libs/common';
import { N_PAY_RESEARCH, REQUEST_HEADERS } from '../constants';
import { InvestReport } from '../interface';

import { figureNid } from '../utils';

@Injectable()
export class InvestReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH, 'invest_list.naver');

  constructor(
    private readonly investReportRepo: InvestReportRepository,
    @InjectQueue(QUEUE_NAME.INVEST_REPORT_SCORE) private readonly queue: Queue,
  ) {}

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
        nid: figureNid(detailUrl),
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
      await this.queue.addBulk(
        new Array(10).fill({
          data: { _id },
          opts: { removeOnComplete: true, removeOnFail: true },
        }),
      );
    }
  }
}
