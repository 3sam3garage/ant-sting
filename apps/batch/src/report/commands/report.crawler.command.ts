import { Command, CommandRunner } from 'nest-commander';
import { InvestReportCrawlerTask } from '../tasks';

enum SUB_COMMAND {
  INVEST = 'invest',
  STOCK = 'stock',
}

@Command({ name: 'report' })
export class ReportCrawlerCommand extends CommandRunner {
  constructor(
    private readonly financialStatementCrawlerTask: InvestReportCrawlerTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.INVEST:
        return await this.financialStatementCrawlerTask.exec();
      case SUB_COMMAND.STOCK:
      // return await this.financialStatementCrawlerTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
