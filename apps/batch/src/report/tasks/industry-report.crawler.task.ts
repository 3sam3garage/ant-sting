import { Injectable } from '@nestjs/common';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import { N_PAY_RESEARCH_URL } from '../constants';
import { IndustryReport } from '../interface';
import { figureNid } from '../utils';
import {
  IndustryReportRepository,
  IndustryReport as IndustryReportEntity,
} from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';

@Injectable()
export class IndustryReportCrawlerTask {
  private readonly URL = joinUrl(N_PAY_RESEARCH_URL, 'industry_list.naver');

  constructor(
    private readonly industryReportRepo: IndustryReportRepository,
    @InjectQueue(QUEUE_NAME.INDUSTRY_REPORT_SCORE)
    private readonly queue: Queue,
  ) {}

  async exec() {
    const html = await requestAndParseEucKr(this.URL);

    const rows = html
      .querySelectorAll('#contentarea_left > div.box_type_m > table.type_1 tr')
      .filter((row) => row.querySelector('td.file'));

    const industryReports: IndustryReport[] = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td:not(.file)');
      const titleAnchor = row.querySelector('td > a');
      const [industryType, , stockFirm, date, views] = cells.map((cell) =>
        cell.innerText.trim(),
      );
      const anchor = row.querySelector('td.file > a');
      const detailUrl = titleAnchor.getAttribute('href');

      industryReports.push({
        industryType,
        title: titleAnchor.innerHTML.trim(),
        nid: figureNid(detailUrl),
        detailUrl,
        stockFirm,
        date: formatSixDigitDate(date),
        views,
        file: anchor.getAttribute('href'),
      });
    }

    for (const report of industryReports) {
      let industryReport = await this.industryReportRepo.findOneByNid(
        report.nid,
      );
      if (industryReport) {
        await this.industryReportRepo.save({ ...industryReport, ...report });
      } else {
        const entity = IndustryReportEntity.create(report);
        industryReport = await this.industryReportRepo.createOne(entity);
      }

      const _id = industryReport._id.toString();
      await this.queue.addBulk(
        new Array(5).fill({
          data: { _id },
          opts: { removeOnComplete: true, removeOnFail: true },
        }),
      );
    }
  }
}
