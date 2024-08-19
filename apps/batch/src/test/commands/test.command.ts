import { Command, CommandRunner } from 'nest-commander';
import { ReportSummaryTask, TestTask } from '../tasks';

enum SUB_COMMAND {
  QUEUE = 'queue',
  TEST = 'test',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(
    private readonly testTask: TestTask,
    private readonly reportSummaryTask: ReportSummaryTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.QUEUE:
        return await this.testTask.exec();
      case SUB_COMMAND.TEST:
        return await this.reportSummaryTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
