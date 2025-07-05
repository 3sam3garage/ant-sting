import { Queue } from 'bull';
import { parse as parseToHTML } from 'node-html-parser';
import { format } from 'date-fns';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { joinUrl, today } from '@libs/common';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformation,
  EconomicInformationRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { KCIF_RESEARCH_URL, KcifApi } from '@libs/external-api';
import { flatten } from 'lodash';

/**
 * 국제금융센터(KCIF)
 */
@Injectable()
export class KcifEconomicInformationCrawler {
  constructor(
    @InjectQueue(QUEUE_NAME.ECONOMIC_INFORMATION)
    private readonly queue: Queue,
    private readonly repo: EconomicInformationRepository,
    private readonly kcifApi: KcifApi,
  ) {}

  async exec() {
    const date = today();
    let entity = await this.repo.findOneByDate(date);
    if (!entity) {
      entity = await this.repo.createOne(EconomicInformation.create({ date }));
    }

    const infos = await Promise.all([
      this.kcifApi.weekly(),
      this.kcifApi.daily(),
      this.kcifApi.newsFlash(),
    ]);
    const htmlTexts = flatten(infos);

    for (const text of htmlTexts) {
      const html = parseToHTML(text);

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

      for (const url of urls) {
        const payload = { url, documentId: entity._id.toString() };

        await this.queue.add(ECONOMIC_INFO_SOURCE.KCIF, payload);
      }
    }
  }
}
