import { format } from 'date-fns';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  DebentureReport,
  DebentureReportRepository,
  EconomyReport,
  EconomyReportRepository,
  IndustryReport,
  IndustryReportRepository,
  InvestReport,
  InvestReportRepository,
  MarketInfoReport,
  MarketInfoReportRepository,
  REPORT_SUMMARY_TYPE,
  ReportSummary,
  ReportSummaryRepository,
  StockReport,
  StockReportRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { OllamaService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.REPORT_SUMMARY)
export class ReportSummaryConsumer extends BaseConsumer {
  constructor(
    private readonly investReportRepo: InvestReportRepository,
    private readonly debentureReportRepo: DebentureReportRepository,
    private readonly economyReportRepo: EconomyReportRepository,
    private readonly stockReportRepo: StockReportRepository,
    private readonly industryReportRepo: IndustryReportRepository,
    private readonly marketInfoReportRepo: MarketInfoReportRepository,
    private readonly reportSummaryRepo: ReportSummaryRepository,
    private readonly ollamaService: OllamaService,
  ) {
    super();
  }

  private figureType(
    entity:
      | InvestReport
      | DebentureReport
      | EconomyReport
      | StockReport
      | IndustryReport
      | MarketInfoReport,
  ): REPORT_SUMMARY_TYPE {
    switch (true) {
      case entity instanceof InvestReport:
        return REPORT_SUMMARY_TYPE.DAILY_INVEST_REPORT_SUMMARY;
      case entity instanceof DebentureReport:
        return REPORT_SUMMARY_TYPE.DAILY_DEBENTURE_REPORT_SUMMARY;
      case entity instanceof EconomyReport:
        return REPORT_SUMMARY_TYPE.DAILY_ECONOMY_REPORT_SUMMARY;
      case entity instanceof StockReport:
        return REPORT_SUMMARY_TYPE.DAILY_STOCK_REPORT_SUMMARY;
      case entity instanceof IndustryReport:
        return REPORT_SUMMARY_TYPE.DAILY_INDUSTRY_REPORT_SUMMARY;
      case entity instanceof MarketInfoReport:
        return REPORT_SUMMARY_TYPE.DAILY_MARKET_INFO_REPORT_SUMMARY;
    }
  }

  @Process({ concurrency: 1 })
  async run({ data: { date } }: Job<{ date: string }>) {
    const query = {
      where: { summary: { $exists: true }, date },
      select: { summary: true },
    };
    const reportLists = await Promise.all([
      this.investReportRepo.find(query),
      this.marketInfoReportRepo.find(query),
      this.economyReportRepo.find(query),
      this.industryReportRepo.find(query),
      this.debentureReportRepo.find(query),
      this.stockReportRepo.find(query),
    ]);

    for (const reports of reportLists) {
      const summary = reports.map((item) => item.summary).join('\n\n');
      const entity = reports.shift();
      const type = this.figureType(entity);

      if (!type) {
        continue;
      }

      const aiScore = await this.ollamaService.scoreSummary(summary);
      const report = await this.reportSummaryRepo.findOne({
        where: { date, type },
      });

      if (report) {
        report.summary = summary;
        report.addScore(aiScore);
        await this.reportSummaryRepo.save(report);
      } else {
        const entity = ReportSummary.create({ date, type, summary });
        await this.reportSummaryRepo.save(entity);
      }
    }
  }
}
