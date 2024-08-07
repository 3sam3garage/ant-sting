import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { IndustryReportRepository, POST_FIX, QUERY } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { eucKR2utf8, joinUrl } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.INDUSTRY_REPORT_SCORE)
export class IndustryReportConsumer extends BaseConsumer {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(private readonly repo: IndustryReportRepository) {
    super();
  }

  @Process({ concurrency: 2 })
  async run({ data }: Job<{ _id: string }>) {
    const industryReport = await this.repo.findOneById(new ObjectId(data._id));

    if (!industryReport.summary) {
      const response = await axios.get(
        joinUrl(this.BASE_URL, industryReport.detailUrl),
        { responseType: 'arraybuffer' },
      );

      const text = eucKR2utf8(response.data);
      const html = parseToHTML(text);

      industryReport.summary = html
        .querySelectorAll('table td.view_cnt p')
        .map((item) => item?.innerText?.trim())
        .join('\n');

      await this.repo.save(industryReport);
    }

    try {
      const aiResponse = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3.1',
          prompt: `${industryReport.summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        },
      );

      const { reason, score } = JSON.parse(aiResponse.data.response);
      industryReport.addAiScore({ reason, score: +score });
      await this.repo.save(industryReport);
    } catch (e) {
      Logger.error(e);
    }
  }
}
