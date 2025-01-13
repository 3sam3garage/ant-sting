import { Command, CommandRunner } from 'nest-commander';
import { TestTask, TestTask2 } from '../tasks';

enum SUB_COMMAND {
  TEST = 'test',
  TEST2 = 'test2',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(
    private readonly testTask: TestTask,
    private readonly testTask2: TestTask2,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.TEST:
        return await this.testTask.exec();
      case SUB_COMMAND.TEST2:
        return await this.testTask2.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
