import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { eucKR2utf8, formatSixDigitDate, joinUrl } from '@libs/common';
import { N_PAY_RESEARCH, REQUEST_HEADERS } from '../constants';
import { DebentureReport } from '../interface';
import { figureNid } from '../utils';
import {
  DebentureReportRepository,
  DebentureReport as DebentureEntity,
} from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';

@Injectable()
export class DebentureReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH, 'debenture_list.naver');

  constructor(
    private readonly debentureReportRepository: DebentureReportRepository,
    @InjectQueue(QUEUE_NAME.DEBENTURE_REPORT_SCORE)
    private readonly queue: Queue,
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

    const debentureReports: DebentureReport[] = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td:not(.file)');
      const titleAnchor = cells.shift().querySelector('a');
      const [stockFirm, date, views] = cells.map((cell) =>
        cell.innerText.trim(),
      );
      const anchor = row.querySelector('td.file > a');
      const detailUrl = titleAnchor.getAttribute('href');

      debentureReports.push({
        title: titleAnchor.innerHTML.trim(),
        nid: figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const report of debentureReports) {
      let debentureReport = await this.debentureReportRepository.findOneByNid(
        report.nid,
      );
      if (debentureReport) {
        await this.debentureReportRepository.updateOne(debentureReport, report);
      } else {
        const entity = DebentureEntity.create(report);
        debentureReport =
          await this.debentureReportRepository.createOne(entity);
      }

      const _id = debentureReport._id.toString();
      await this.queue.add(
        { _id },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
  }
}
