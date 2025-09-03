import { Queue } from 'bull';
import { parse as parseToHTML } from 'node-html-parser';
import { format } from 'date-fns';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { joinUrl, today } from '@libs/shared/common';
import { QUEUE_NAME } from '@libs/shared/config';
import { flatten } from 'lodash';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformationMessage,
} from '@libs/shared/core';
import {
  EconomicInformation,
  EconomicInformationRepositoryImpl,
} from '@libs/domain';
import {
  EXTERNAL_API_TOKEN,
  KcifApiImpl,
  MONGO_REPOSITORY_TOKEN,
} from '@libs/application';

/**
 * 국제금융센터(KCIF)
 */
@Injectable()
export class KcifEconomicInformationCrawler {
  private readonly BASE_URL = 'https://www.kcif.or.kr';

  constructor(
    @InjectQueue(QUEUE_NAME.ECONOMIC_INFORMATION)
    private readonly queue: Queue,
    @Inject(MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION)
    private readonly repo: EconomicInformationRepositoryImpl,
    @Inject(EXTERNAL_API_TOKEN.KCIF_API)
    private readonly kcifApi: KcifApiImpl,
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
          urls.push(joinUrl(this.BASE_URL, href));
        }
      }

      for (const url of urls) {
        const payload: EconomicInformationMessage = {
          url,
          documentId: entity._id.toString(),
        };

        await this.queue.add(ECONOMIC_INFO_SOURCE.KCIF, payload);
      }
    }
  }
}
