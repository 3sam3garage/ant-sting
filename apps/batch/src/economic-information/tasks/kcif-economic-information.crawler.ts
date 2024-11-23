import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { joinUrl, today } from '@libs/common';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformation,
  EconomicInformationRepository,
  KCIF_RESEARCH_URL,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';

/**
 * 매크로 환경
 * - 시황
 * - 투자정보
 * - 경제분석
 * - 채권분석
 */
@Injectable()
export class KcifEconomicInformationCrawler {
  private readonly DETAIL_URLS = [
    '/annual/newsflashList',
    '/annual/weeklyList',
    '/annual/dailyList',
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

    for (const detailUrl of this.DETAIL_URLS) {
      const url = joinUrl(KCIF_RESEARCH_URL, detailUrl);
      const response = await axios.get(url);
      const html = parseToHTML(response.data);

      const rows = html.querySelectorAll(
        'div.page_list_wrap > ul.page_list > li',
      );

      const urls: string[] = [];
      for (const row of rows) {
        const titleAnchor = row.querySelector('a');
        const href = titleAnchor?.getAttribute('href');

        urls.push(joinUrl(KCIF_RESEARCH_URL, href));
      }

      await this.queue.addBulk(
        urls.map((url) => ({
          data: {
            url,
            documentId: entity._id,
            source: ECONOMIC_INFO_SOURCE.KCIF,
          },
          opts: { removeOnComplete: true, removeOnFail: true },
        })),
      );
    }
  }
}
