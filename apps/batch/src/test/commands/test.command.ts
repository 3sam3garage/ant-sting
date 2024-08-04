import { Command, CommandRunner } from 'nest-commander';
import { TestTask } from '../tasks';

enum SUB_COMMAND {
  QUEUE = 'queue',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(private readonly testTask: TestTask) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.QUEUE:
        return await this.testTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
