import { Command, CommandRunner } from 'nest-commander';
import { MacroEnvironmentCrawlerTask, StockReportCrawlerTask } from '../tasks';

enum SUB_COMMAND {
  // 거시 환경 정보
  MARKET_INFO = 'macro-environment',
  // 종목 분석 리포트
  STOCK = 'stock',
}

@Command({ name: 'report' })
export class ReportCrawlerCommand extends CommandRunner {
  constructor(
    private readonly marketInfoReportCrawlerTask: MacroEnvironmentCrawlerTask,
    private readonly stockReportCrawlerTask: StockReportCrawlerTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.MARKET_INFO:
        return await this.marketInfoReportCrawlerTask.exec();
      case SUB_COMMAND.STOCK:
        return await this.stockReportCrawlerTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
