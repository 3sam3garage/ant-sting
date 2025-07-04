import { parse as parseToHTML } from 'node-html-parser';
import { ObjectId } from 'mongodb';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformationMessage,
  EconomicInformationRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { KcifApi, NaverPayApi } from '@libs/external-api';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class EconomicInformationConsumer extends BaseConsumer {
  constructor(
    private readonly repo: EconomicInformationRepository,
    private readonly naverPayApi: NaverPayApi,
    private readonly kcifApi: KcifApi,
  ) {
    super();
  }

  private async scrapeNaver(url: string): Promise<string> {
    const response = await this.naverPayApi.scrapeDetailPage(url);
    const html = parseToHTML(response);

    const content = html
      .querySelectorAll('.view_cnt p')
      .map((item) => item?.innerText?.trim())
      .join('\n');

    return content;
  }

  private async scrapeKCIF(url: string): Promise<string> {
    const response = await this.kcifApi.scrapeDetailPage(url);
    const html = parseToHTML(response);

    const text = html.querySelector('div.cont_area').innerText;
    const content = text
      .replaceAll(/&middot;/g, '•')
      .replaceAll(/&amp;/g, '&')
      .replaceAll(/&nbsp;/g, ' ')
      .trim();

    return content;
  }

  @Process({ concurrency: 1 })
  async run({ data }: Job<EconomicInformationMessage>) {
    const { documentId, url, source } = data;

    let content: string;
    switch (source) {
      case ECONOMIC_INFO_SOURCE.NAVER:
        content = await this.scrapeNaver(url);
        break;
      case ECONOMIC_INFO_SOURCE.KCIF:
        content = await this.scrapeKCIF(url);
        break;
      default:
        return;
    }

    const entity = await this.repo.findOneById(new ObjectId(documentId));
    return await this.repo.updateOne(entity, {
      items: [...entity.items, content],
    });
  }
}
