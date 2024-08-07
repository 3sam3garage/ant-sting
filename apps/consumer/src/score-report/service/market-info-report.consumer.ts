import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { MarketInfoReportRepository, POST_FIX, QUERY } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { eucKR2utf8, joinUrl } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.MARKET_INFO_REPORT_SCORE)
export class MarketInfoReportConsumer extends BaseConsumer {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(private readonly repo: MarketInfoReportRepository) {
    super();
  }

  @Process({ concurrency: 2 })
  async run({ data }: Job<{ _id: string }>) {
    const marketInfoReport = await this.repo.findOneById(
      new ObjectId(data._id),
    );

    if (!marketInfoReport.summary) {
      const response = await axios.get(
        joinUrl(this.BASE_URL, marketInfoReport.detailUrl),
        { responseType: 'arraybuffer' },
      );

      const text = eucKR2utf8(response.data);
      const html = parseToHTML(text);

      marketInfoReport.summary = html
        .querySelectorAll('table td.view_cnt p')
        .map((item) => item?.innerText?.trim())
        .join('\n');

      await this.repo.save(marketInfoReport);
    }

    try {
      const aiResponse = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3.1',
          prompt: `${marketInfoReport.summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        },
      );

      const { reason, score } = JSON.parse(aiResponse.data.response);
      marketInfoReport.addAiScore({ reason, score: +score });
      await this.repo.save(marketInfoReport);
    } catch (e) {
      Logger.error(e);
    }
  }
}
