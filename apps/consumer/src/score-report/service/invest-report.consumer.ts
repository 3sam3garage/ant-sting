import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { InvestReportRepository, POST_FIX, QUERY } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { eucKR2utf8, joinUrl } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.INVEST_REPORT_SCORE)
export class InvestReportConsumer extends BaseConsumer {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(private readonly repo: InvestReportRepository) {
    super();
  }

  @Process({ concurrency: 2 })
  async run({ data }: Job<{ _id: string }>) {
    const investReport = await this.repo.findOneById(new ObjectId(data._id));

    if (!investReport.summary) {
      const response = await axios.get(
        joinUrl(this.BASE_URL, investReport.detailUrl),
        { responseType: 'arraybuffer' },
      );

      const text = eucKR2utf8(response.data);
      const html = parseToHTML(text);

      investReport.summary = html
        .querySelectorAll('table td.view_cnt p')
        .map((item) => item?.innerText?.trim())
        .join('\n');

      await this.repo.save(investReport);
    }

    try {
      const aiResponse = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3.1',
          prompt: `${investReport.summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        },
      );

      const { reason, score } = JSON.parse(aiResponse.data.response);
      investReport.addAiScore({ reason, score: +score });
      await this.repo.save(investReport);
    } catch (e) {
      Logger.error(e);
    }
  }
}
