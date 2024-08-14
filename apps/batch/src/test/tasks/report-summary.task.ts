import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { eucKR2utf8, joinUrl } from '@libs/common';
import { InvestReportRepository, POST_FIX, QUERY } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';

@Injectable()
export class ReportSummaryTask {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(
    private readonly repo: InvestReportRepository,
    @InjectQueue(QUEUE_NAME.INVEST_REPORT_SCORE) private readonly queue: Queue,
  ) {}

  async exec(): Promise<void> {
    const investReports = await this.repo.find({});

    for (const investReport of investReports) {
      const response = await axios.get(
        joinUrl(this.BASE_URL, investReport.detailUrl),
        { responseType: 'arraybuffer' },
      );

      const text = eucKR2utf8(response.data);
      const html = parseToHTML(text);

      const summary = html
        .querySelectorAll('table td.view_cnt p')
        .map((item) => item?.innerText?.trim())
        .join('\n');

      const aiResponse = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3.1',
          prompt: `${summary} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        },
      );

      try {
        const { reason, score } = JSON.parse(aiResponse.data.response);
        investReport.summary = summary;
        investReport.addScore({ reason, score: +score });
        await this.repo.save(investReport);
      } catch (e) {
        Logger.error(e);
      }
    }
  }
}
