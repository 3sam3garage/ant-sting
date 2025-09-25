import { Command, CommandRunner } from 'nest-commander';
import { Sec13fTask } from '../tasks/sec-13f.task';
import { ScrapeRssTask } from '../tasks/scrape-rss.task';
import { PostWepollTask } from '../tasks/post-wepoll.task';

enum SUB_COMMAND {
  SEC_13F = 'sec-13f',
  SCRAPE_RSS = 'scrape-rss',
  POST_WEPOLL = 'post-wepoll',
}

@Command({ name: 'poc' })
export class PocCommand extends CommandRunner {
  constructor(
    private readonly sec13fTask: Sec13fTask,
    private readonly scrapeRssTask: ScrapeRssTask,
    private readonly postWepollTask: PostWepollTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SEC_13F:
        return await this.sec13fTask.exec();
      case SUB_COMMAND.SCRAPE_RSS:
        return await this.scrapeRssTask.exec();
      case SUB_COMMAND.POST_WEPOLL:
        return await this.postWepollTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
