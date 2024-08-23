import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IndustryReportRepository } from '@libs/domain';
import { OllamaService } from '@libs/ai';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl, requestAndParseEucKr } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.INDUSTRY_REPORT_SCORE)
export class IndustryReportConsumer extends BaseConsumer {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(
    private readonly repo: IndustryReportRepository,
    private readonly ollamaService: OllamaService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data }: Job<{ _id: string }>) {
    const report = await this.repo.findOneById(new ObjectId(data._id));

    if (!report.summary) {
      const html = await requestAndParseEucKr(
        joinUrl(this.BASE_URL, report.detailUrl),
      );

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
      report.addScore({ reason, score: +score });
      await this.repo.save(report);
    } catch (e) {
      Logger.error(e);
    }
  }
}
