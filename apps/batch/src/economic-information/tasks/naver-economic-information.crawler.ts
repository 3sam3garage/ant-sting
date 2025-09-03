import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { parse as parseToHTML } from 'node-html-parser';
import { formatSixDigitDate, today } from '@libs/shared/common';
import { flatten } from 'lodash';
import { QUEUE_NAME } from '@libs/shared/config';
import {
  EconomicInformation,
  EconomicInformationRepositoryImpl,
} from '@libs/domain';
import {
  EXTERNAL_API_TOKEN,
  MONGO_REPOSITORY_TOKEN,
  NaverApiImpl,
} from '@libs/application';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformationMessage,
} from '@libs/shared/core';

/**
 * 매크로 환경
 * - 시황
 * - 투자정보
 * - 경제분석
 * - 채권분석
 */
@Injectable()
export class NaverEconomicInformationCrawler {
  constructor(
    @InjectQueue(QUEUE_NAME.ECONOMIC_INFORMATION)
    private readonly queue: Queue,
    @Inject(EXTERNAL_API_TOKEN.NAVER_PAY_API)
    private readonly naverPayApi: NaverApiImpl,
    @Inject(MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION)
    private readonly repo: EconomicInformationRepositoryImpl,
  ) {}

  async exec() {
    const date = today();
    let entity = await this.repo.findOneByDate(date);
    if (!entity) {
      entity = await this.repo.createOne(EconomicInformation.create({ date }));
    }

    const groupedInfos = await Promise.all([
      this.naverPayApi.debentureInfo(),
      this.naverPayApi.economyInfo(),
      this.naverPayApi.investInfo(),
      this.naverPayApi.marketInfo(),
    ]);

    const htmlTexts: string[] = flatten(groupedInfos);
    for (const text of htmlTexts) {
      const html = parseToHTML(text);
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
          // Logger.debug('Skipping previous data');
          continue;
        }

        const titleAnchor = cells.shift().querySelector('a');
        const detailUrl = titleAnchor.getAttribute('href');
        urls.push(detailUrl);
      }

      for (const url of urls) {
        const payload: EconomicInformationMessage = {
          url,
          documentId: entity._id.toString(),
        };

        await this.queue.add(ECONOMIC_INFO_SOURCE.NAVER, payload);
      }
    }
  }
}
