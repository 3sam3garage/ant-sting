import { Command, CommandRunner } from 'nest-commander';
import { SendSlackNotificationTask } from '../tasks';

enum SUB_COMMAND {
  SEND_SLACK = 'send-slack',
}

@Command({ name: 'notification' })
export class NotificationCommand extends CommandRunner {
  constructor(
    private readonly sendSlackNotificationTask: SendSlackNotificationTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SEND_SLACK:
        return await this.sendSlackNotificationTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
