import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
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
  ReportSummary,
  ReportSummaryRepository,
  StockReport,
  StockReportRepository,
} from '@libs/domain';
import { retry } from '@libs/common';
import { REPORT_SUMMARY_TYPE } from '@libs/domain';
import { OllamaService } from '@libs/ai';

@Injectable()
export class DailyReportSummaryTask {
  constructor(
    private readonly investReportRepo: InvestReportRepository,
    private readonly debentureReportRepo: DebentureReportRepository,
    private readonly economyReportRepo: EconomyReportRepository,
    private readonly stockReportRepo: StockReportRepository,
    private readonly industryReportRepo: IndustryReportRepository,
    private readonly marketInfoReportRepo: MarketInfoReportRepository,
    private readonly reportSummaryRepo: ReportSummaryRepository,
    private readonly ollamaService: OllamaService,
  ) {}

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

  async exec() {
    // @todo date fixed 된 값 나중에 뺄 것.
    const date = format(new Date('2024-08-08'), 'yyyy-MM-dd');
    const query = {
      where: { summary: { $exists: true }, date },
      select: { summary: true },
    };
    const reportLists = await Promise.all([
      this.investReportRepo.find(query),
      this.debentureReportRepo.find(query),
      this.economyReportRepo.find(query),
      this.stockReportRepo.find(query),
      this.industryReportRepo.find(query),
      this.marketInfoReportRepo.find(query),
    ]);

    for (const reports of reportLists) {
      const summary = reports.map((item) => item.summary).join('\n\n');
      const entity = reports.shift();
      const type = this.figureType(entity);

      if (!type) {
        continue;
      }

      await retry(async () => {
        const aiScore = await this.ollamaService.scoreSummary(summary);
        const report = await this.reportSummaryRepo.findOne({
          where: { date, type },
        });

        if (report) {
          report.addScore(aiScore);
          await this.reportSummaryRepo.save(report);
        } else {
          const entity = ReportSummary.create({ date, type });
          await this.reportSummaryRepo.save(entity);
        }
      }, 3);
    }
  }
}
