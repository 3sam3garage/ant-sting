import { Command, CommandRunner } from 'nest-commander';
import { GraphEconomicInformationTask } from '../tasks/graph-economic-information.task';
import { ScrapePolyMarketTask } from '../tasks/scrape-poly-market.task';

enum SUB_COMMAND {
  GRAPH = 'graph',
  SCRAPE_POLY_MARKET = 'poly-market',
}

@Command({ name: 'poc' })
export class PocCommand extends CommandRunner {
  constructor(
    private readonly graphEconomicInformationTask: GraphEconomicInformationTask,
    private readonly scrapePolyMarketTask: ScrapePolyMarketTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.GRAPH:
        return await this.graphEconomicInformationTask.exec();
      case SUB_COMMAND.SCRAPE_POLY_MARKET:
        return await this.scrapePolyMarketTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
