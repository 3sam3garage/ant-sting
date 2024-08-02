import { Command, CommandRunner } from 'nest-commander';
import { ReportCrawlerTask } from '../tasks';

@Command({ name: 'report' })
export class ReportCrawlerCommand extends CommandRunner {
  constructor(
    private readonly financialStatementCrawlerTask: ReportCrawlerTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    // const [subcommand, param] = passedParam;

    await this.financialStatementCrawlerTask.exec();
  }
}
