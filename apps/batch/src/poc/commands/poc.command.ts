import { Command, CommandRunner } from 'nest-commander';
import { GraphEconomicInformationTask } from '../tasks/graph-economic-information.task';
import { Sec13fTask } from '../tasks/sec-13f.task';
import { ScrapeRssTask } from '../tasks/scrape-rss.task';

enum SUB_COMMAND {
  GRAPH = 'graph',
  SEC_13F = 'sec-13f',
  SCRAPE_RSS = 'scrape-rss',
}

@Command({ name: 'poc' })
export class PocCommand extends CommandRunner {
  constructor(
    private readonly graphEconomicInformationTask: GraphEconomicInformationTask,
    private readonly sec13fTask: Sec13fTask,
    private readonly scrapeRssTask: ScrapeRssTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.GRAPH:
        return await this.graphEconomicInformationTask.exec();
      case SUB_COMMAND.SEC_13F:
        return await this.sec13fTask.exec();
      case SUB_COMMAND.SCRAPE_RSS:
        return await this.scrapeRssTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
