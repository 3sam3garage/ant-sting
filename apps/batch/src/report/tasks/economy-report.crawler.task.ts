import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { eucKR2utf8, formatSixDigitDate, joinUrl } from '@libs/common';
import { N_PAY_RESEARCH_URL, REQUEST_HEADERS } from '../constants';
import { EconomyReport } from '../interface';
import { figureNid } from '../utils';
import {
  EconomyReportRepository,
  EconomyReport as EconomyReportEntity,
} from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';

@Injectable()
export class EconomyReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH_URL, 'economy_list.naver');

  constructor(
    private readonly economyReportRepo: EconomyReportRepository,
    @InjectQueue(QUEUE_NAME.ECONOMY_REPORT_SCORE) private readonly queue: Queue,
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

    const economyReports: EconomyReport[] = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td:not(.file)');
      const titleAnchor = cells.shift().querySelector('a');
      const [stockFirm, date, views] = cells.map((cell) =>
        cell.innerText.trim(),
      );
      const anchor = row.querySelector('td.file > a');
      const detailUrl = titleAnchor.getAttribute('href');

      economyReports.push({
        title: titleAnchor.innerHTML.trim(),
        nid: figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const report of economyReports) {
      let economyReport = await this.economyReportRepo.findOneByNid(report.nid);
      if (economyReport) {
        await this.economyReportRepo.updateOne(economyReport, report);
      } else {
        const entity = EconomyReportEntity.create(report);
        economyReport = await this.economyReportRepo.createOne(entity);
      }

      const _id = economyReport._id.toString();
      await this.queue.addBulk(
        new Array(10).fill({
          data: { _id },
          opts: { removeOnComplete: true, removeOnFail: true },
        }),
      );
    }
  }
}
