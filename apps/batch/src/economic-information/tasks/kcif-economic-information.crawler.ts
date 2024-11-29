import { Queue } from 'bull';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { format } from 'date-fns';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { joinUrl } from '@libs/common';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformation,
  EconomicInformationRepository,
  KCIF_RESEARCH_URL,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { figureDateInfo } from '@libs/common/figure-date-info';

/**
 * 매크로 환경 정보 - 국제금융센터(KCIF)
 * - 국제금융속보
 * - 주간보고서
 * - 특별일보
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
    const { date, startOfDay, endOfDay } = figureDateInfo();
    let entity = await this.repo.findOneByDate(startOfDay, endOfDay);
    if (!entity) {
      entity = await this.repo.createOne(
        EconomicInformation.create({ date: new Date(date) }),
      );
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
        const dateAnchor = row.querySelector(
          'div.txt_bot > div.txt_wrap > span:nth-child(3)',
        );
        const href = titleAnchor?.getAttribute('href');

        const reportDate = format(
          new Date(dateAnchor?.innerText),
          'yyyy-MM-dd',
        );

        if (date === reportDate) {
          urls.push(joinUrl(KCIF_RESEARCH_URL, href));
        }
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
