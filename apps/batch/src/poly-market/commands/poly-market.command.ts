import { Command, CommandRunner } from 'nest-commander';
import { ScrapePollTask } from '../tasks';

enum SUB_COMMAND {
  POLL = 'poll',
}

@Command({ name: 'poly-market' })
export class PolyMarketCommand extends CommandRunner {
  constructor(private readonly scrapePolyMarketTask: ScrapePollTask) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.POLL:
        return await this.scrapePolyMarketTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
