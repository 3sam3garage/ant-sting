import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { StockReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { OllamaService } from '@libs/ai';
import { eucKR2utf8, joinUrl } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.STOCK_REPORT_SCORE)
export class StockReportConsumer extends BaseConsumer {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(
    private readonly repo: StockReportRepository,
    private readonly ollamaService: OllamaService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data }: Job<{ _id: string }>) {
    const report = await this.repo.findOneById(new ObjectId(data._id));

    if (!report.summary) {
      const response = await axios.get(
        joinUrl(this.BASE_URL, report.detailUrl),
        { responseType: 'arraybuffer' },
      );

      const text = eucKR2utf8(response.data);
      const html = parseToHTML(text);

      report.summary = html
        .querySelectorAll('table td.view_cnt p')
        .map((item) => item?.innerText?.trim())
        .join('\n');

      await this.repo.save(report);
    }

    try {
      const { reason, score } = await this.ollamaService.scoreSummary(
        report.summary,
      );

      report.addAiScore({ reason, score: +score });
      await this.repo.save(report);
    } catch (e) {
      Logger.error(e);
    }
  }
}
