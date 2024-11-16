import { ObjectId } from 'mongodb';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import {
  EconomicInformationMessage,
  EconomicInformationRepository,
  N_PAY_RESEARCH_URL,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl, requestAndParseEucKr } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ECONOMIC_INFORMATION)
export class EconomicInformationConsumer extends BaseConsumer {
  constructor(private readonly repo: EconomicInformationRepository) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data }: Job<EconomicInformationMessage>) {
    const { documentId, url } = data;
    const html = await requestAndParseEucKr(joinUrl(N_PAY_RESEARCH_URL, url));
    const summary = html
      .querySelectorAll('table td.view_cnt p')
      .map((item) => item?.innerText?.trim())
      .join('\n');

    const entity = await this.repo.findOneById(new ObjectId(documentId));
    return await this.repo.updateOne(entity, {
      items: [...entity.items, summary],
    });
  }
}
