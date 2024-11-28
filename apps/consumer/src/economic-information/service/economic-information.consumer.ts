import { ObjectId } from 'mongodb';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import {
  ECONOMIC_INFO_SOURCE,
  EconomicInformationMessage,
  EconomicInformationRepository,
  N_PAY_BASE_URL,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl, requestAndParseEucKr } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class EconomicInformationConsumer extends BaseConsumer {
  constructor(private readonly repo: EconomicInformationRepository) {
    super();
  }

  private async scrapeNaver(url: string): Promise<string> {
    const html = await requestAndParseEucKr(joinUrl(N_PAY_BASE_URL, url));
    const content = html
      .querySelectorAll('table td.view_cnt p')
      .map((item) => item?.innerText?.trim())
      .join('\n');

    return content;
  }

  private async scrapeKCIF(url: string): Promise<string> {
    const response = await axios.get(url);
    const html = parseToHTML(response.data);

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
