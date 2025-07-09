import { parse as parseToHTML } from 'node-html-parser';
import { ObjectId } from 'mongodb';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import {
  EconomicInformationMessage,
  EconomicInformationRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { KcifApi, NaverPayApi } from '@libs/external-api';
import { BaseConsumer } from '../../base.consumer';
import { ECONOMIC_INFO_SOURCE } from '@libs/core';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class EconomicInformationConsumer extends BaseConsumer {
  constructor(
    private readonly repo: EconomicInformationRepository,
    private readonly naverPayApi: NaverPayApi,
    private readonly kcifApi: KcifApi,
  ) {
    super();
  }

  @Process({
    name: ECONOMIC_INFO_SOURCE.NAVER,
    concurrency: 1,
  })
  async naver({ data }: Job<EconomicInformationMessage>) {
    const { documentId, url } = data;
    const response = await this.naverPayApi.detailPage(url);
    const html = parseToHTML(response);

    const content = html
      .querySelectorAll('.view_cnt p')
      .map((item) => item?.innerText?.trim())
      .join('\n');

    const entity = await this.repo.findOneById(new ObjectId(documentId));
    return await this.repo.updateOne(entity, {
      items: [...entity.items, content],
    });
  }

  @Process({
    name: ECONOMIC_INFO_SOURCE.KCIF,
    concurrency: 1,
  })
  async kcif({ data }: Job<EconomicInformationMessage>) {
    const { documentId, url } = data;
    const response = await this.kcifApi.detailPage(url);
    const html = parseToHTML(response);

    const text = html.querySelector('div.cont_area').innerText;
    const content = text
      .replaceAll(/&middot;/g, '•')
      .replaceAll(/&amp;/g, '&')
      .replaceAll(/&nbsp;/g, ' ')
      .trim();

    const entity = await this.repo.findOneById(new ObjectId(documentId));
    return await this.repo.updateOne(entity, {
      items: [...entity.items, content],
    });
  }
}
