import { parse as parseToHTML } from 'node-html-parser';
import { ObjectId } from 'mongodb';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { EconomicInformationRepository } from '@libs/mongo';
import { QUEUE_NAME } from '@libs/config';
import { KcifApi, NaverPayApi } from '@libs/external-api';
import { ECONOMIC_INFO_SOURCE, EconomicInformationMessage } from '@libs/core';
import { BaseConsumer } from '../../base.consumer';
import { EconomicInformationRepositoryImpl } from '@libs/domain';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class EconomicInformationConsumer extends BaseConsumer {
  constructor(
    @Inject(EconomicInformationRepository)
    private readonly repo: EconomicInformationRepositoryImpl,
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
    entity.addItem(content);
    return await this.repo.save(entity);
  }

  @Process({
    name: ECONOMIC_INFO_SOURCE.KCIF,
    concurrency: 1,
  })
  async kcif({ data }: Job<EconomicInformationMessage>) {
    const { documentId, url } = data;
    const response = await this.kcifApi.detailPage(url);
    const html = parseToHTML(response);

    const text = html.querySelector('div.cont_area')?.innerText;
    if (!text) {
      Logger.warn('컨텐츠가 없습니다.');
      return;
    }

    const content = text
      .replaceAll(/&middot;/g, '•')
      .replaceAll(/&amp;/g, '&')
      .replaceAll(/&nbsp;/g, ' ')
      .trim();

    const entity = await this.repo.findOneById(new ObjectId(documentId));
    entity.addItem(content);
    return await this.repo.save(entity);
  }
}
