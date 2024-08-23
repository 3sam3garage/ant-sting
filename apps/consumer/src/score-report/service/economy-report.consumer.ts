import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { EconomyReportRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl, requestAndParseEucKr } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';
import { OllamaService } from '@libs/ai';

@Processor(QUEUE_NAME.ECONOMY_REPORT_SCORE)
export class EconomyReportConsumer extends BaseConsumer {
  private readonly BASE_URL = 'https://finance.naver.com/research';

  constructor(
    private readonly repo: EconomyReportRepository,
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
