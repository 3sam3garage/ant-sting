import { Injectable } from '@nestjs/common';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import { N_PAY_RESEARCH_URL } from '../constants';
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
    const html = await requestAndParseEucKr(this.URL);

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
        await this.economyReportRepo.save({ ...economyReport, ...report });
      } else {
        const entity = EconomyReportEntity.create(report);
        economyReport = await this.economyReportRepo.createOne(entity);
      }

      const _id = economyReport._id.toString();
      await this.queue.addBulk(
        new Array(5).fill({
          data: { _id },
          opts: { removeOnComplete: true, removeOnFail: true },
        }),
      );
    }
  }
}
