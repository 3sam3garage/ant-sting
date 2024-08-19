import { Command, CommandRunner } from 'nest-commander';
import {
  EconomyReportCrawlerTask,
  InvestReportCrawlerTask,
  MarketInfoReportCrawlerTask,
  IndustryReportCrawlerTask,
  DebentureReportCrawlerTask,
  StockReportCrawlerTask,
} from '../tasks';
import { DailyReportSummaryTask } from '../tasks/daily-report-summary.task';

enum SUB_COMMAND {
  // 시황 정보 리포트
  MARKET_INFO = 'market-info',
  // 투자 정보 리포트
  INVEST = 'invest',
  // 종목 분석 리포트
  STOCK = 'stock',
  // 산업 분석 리포트
  INDUSTRY = 'industry',
  // 경제 분석 리포트
  ECONOMY = 'economy',
  // 채권 분석 리포트
  DEBENTURE = 'debenture',

  DAILY_SUMMARY = 'summary',
}

@Command({ name: 'report' })
export class ReportCrawlerCommand extends CommandRunner {
  constructor(
    private readonly investReportCrawlerTask: InvestReportCrawlerTask,
    private readonly marketInfoReportCrawlerTask: MarketInfoReportCrawlerTask,
    private readonly industryReportCrawlerTask: IndustryReportCrawlerTask,
    private readonly economyReportCrawlerTask: EconomyReportCrawlerTask,
    private readonly debentureReportCrawlerTask: DebentureReportCrawlerTask,
    private readonly stockReportCrawlerTask: StockReportCrawlerTask,
    private readonly dailyReportSummaryTask: DailyReportSummaryTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.INVEST:
        return await this.investReportCrawlerTask.exec();
      case SUB_COMMAND.MARKET_INFO:
        return await this.marketInfoReportCrawlerTask.exec();
      case SUB_COMMAND.STOCK:
        return await this.stockReportCrawlerTask.exec();
      case SUB_COMMAND.INDUSTRY:
        return await this.industryReportCrawlerTask.exec();
      case SUB_COMMAND.ECONOMY:
        return await this.economyReportCrawlerTask.exec();
      case SUB_COMMAND.DEBENTURE:
        return await this.debentureReportCrawlerTask.exec();
      case SUB_COMMAND.DAILY_SUMMARY:
        return await this.dailyReportSummaryTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
