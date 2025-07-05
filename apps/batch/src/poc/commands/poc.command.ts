import { Command, CommandRunner } from 'nest-commander';
import { GraphEconomicInformationTask } from '../tasks';

enum SUB_COMMAND {
  GRAPH = 'graph',
}

@Command({ name: 'poc' })
export class PocCommand extends CommandRunner {
  constructor(
    private readonly graphEconomicInformationTask: GraphEconomicInformationTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.GRAPH:
        return await this.graphEconomicInformationTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
