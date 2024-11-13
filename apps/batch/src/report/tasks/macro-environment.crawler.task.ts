import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
} from '@libs/common';
import { MacroEnvironmentRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { N_PAY_RESEARCH_URL } from '../constants';
import { MacroEnvironment } from '../interface';
import { figureNid } from '../utils';

/**
 * 매크로 환경
 * - 시황
 * - 투자정보
 * - 경제분석
 * - 채권분석
 */
@Injectable()
export class MacroEnvironmentCrawlerTask {
  private readonly DETAIL_URLS = [
    'market_info_list.naver',
    'invest_list.naver',
    'economy_list.naver',
    'debenture_list.naver',
  ];

  constructor(
    private readonly marketInfoReportRepo: MacroEnvironmentRepository,
    @InjectQueue(QUEUE_NAME.MACRO_ENVIRONMENT)
    private readonly queue: Queue,
  ) {}

  async exec() {
    for (const detailUrl of this.DETAIL_URLS) {
      const url = joinUrl(N_PAY_RESEARCH_URL, detailUrl);

      const html = await requestAndParseEucKr(url);
      const rows = html
        .querySelectorAll(
          '#contentarea_left > div.box_type_m > table.type_1 tr',
        )
        .filter((row) => row.querySelector('td.file'));

      const macroEnvironmentInfo: MacroEnvironment[] = [];
      for (const row of rows) {
        const cells = row.querySelectorAll('td:not(.file)');
        const titleAnchor = cells.shift().querySelector('a');
        const [stockFirm, date, views] = cells.map((cell) =>
          cell.innerText.trim(),
        );
        const anchor = row.querySelector('td.file > a');
        const detailUrl = titleAnchor.getAttribute('href');

        macroEnvironmentInfo.push({
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

    // for (const report of marketInfoReports) {
    //   let investReport = await this.marketInfoReportRepo.findOneByNid(
    //     report.nid,
    //   );
    //   if (investReport) {
    //     await this.marketInfoReportRepo.save({ ...investReport, ...report });
    //   } else {
    //     const entity = MarketInfoReportEntity.create(report);
    //     investReport = await this.marketInfoReportRepo.save(entity);
    //   }
    //
    //   const _id = investReport._id.toString();
    //   await this.queue.addBulk(
    //     new Array(1).fill({
    //       data: { _id },
    //       opts: { removeOnComplete: true, removeOnFail: true },
    //     }),
    //   );
    // }
  }
}
