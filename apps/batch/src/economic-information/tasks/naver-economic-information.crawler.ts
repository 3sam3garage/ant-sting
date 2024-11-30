import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import {
  formatSixDigitDate,
  joinUrl,
  requestAndParseEucKr,
  today,
} from '@libs/common';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformation,
  EconomicInformationRepository,
  N_PAY_BASE_URL,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';

/**
 * 매크로 환경
 * - 시황
 * - 투자정보
 * - 경제분석
 * - 채권분석
 */
@Injectable()
export class NaverEconomicInformationCrawler {
  private readonly DETAIL_URLS = [
    'research/market_info_list.naver',
    'research/invest_list.naver',
    'research/economy_list.naver',
    'research/debenture_list.naver',
  ];

  constructor(
    @InjectQueue(QUEUE_NAME.ECONOMIC_INFORMATION)
    private readonly queue: Queue,
    private readonly repo: EconomicInformationRepository,
  ) {}

  async exec() {
    const date = today();
    let entity = await this.repo.findOneByDate(date);
    if (!entity) {
      entity = await this.repo.createOne(EconomicInformation.create({ date }));
    }

    // crawl data and add to queue
    for (const detailUrl of this.DETAIL_URLS) {
      const url = joinUrl(N_PAY_BASE_URL, detailUrl);

      const html = await requestAndParseEucKr(url);
      const rows = html
        .querySelectorAll(
          '#contentarea_left > div.box_type_m > table.type_1 tr',
        )
        .filter((row) => row.querySelector('td.file'));

      const urls: string[] = [];
      for (const row of rows) {
        const cells = row.querySelectorAll('td:not(.file)');
        const dateInfo = row.querySelector('td.date');
        const currentDate = formatSixDigitDate(dateInfo.textContent);
        if (currentDate !== date) {
          Logger.debug('Skipping previous data');
          continue;
        }

        const titleAnchor = cells.shift().querySelector('a');
        const detailUrl = titleAnchor.getAttribute('href');
        urls.push(detailUrl);
      }
      await this.queue.addBulk(
        urls.map((url) => ({
          data: {
            url,
            documentId: entity._id,
            source: ECONOMIC_INFO_SOURCE.NAVER,
          },
          opts: { removeOnComplete: true, removeOnFail: true },
        })),
      );
    }
  }
}
