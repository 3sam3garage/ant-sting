import { Command, CommandRunner } from 'nest-commander';
import { FinancialStatementCrawlerTask } from '../tasks';

@Command({ name: 'financial-statement' })
export class FinancialStatementCrawlerCommand extends CommandRunner {
  constructor(
    private readonly financialStatementCrawlerTask: FinancialStatementCrawlerTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    // const [subcommand, param] = passedParam;

    await this.financialStatementCrawlerTask.exec();
  }
}
