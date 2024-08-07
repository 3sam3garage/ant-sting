import { Command, CommandRunner } from 'nest-commander';
import { InvestReportCrawlerTask, MarketInfoReportCrawlerTask } from '../tasks';

enum SUB_COMMAND {
  INVEST = 'invest',
  STOCK = 'stock',
  MARKET_INFO = 'market-info',
}

@Command({ name: 'report' })
export class ReportCrawlerCommand extends CommandRunner {
  constructor(
    private readonly investReportCrawlerTask: InvestReportCrawlerTask,
    private readonly marketInfoReportCrawlerTask: MarketInfoReportCrawlerTask,
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
      // return await this.financialStatementCrawlerTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
