import { Command, CommandRunner } from 'nest-commander';
import { BrowserProxyCrawlerTask, TestTask } from '../tasks';

enum SUB_COMMAND {
  TEST = 'test',
  BROWSER_PROXY_CRAWLER = 'browser-proxy-crawler',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(
    private readonly testTask: TestTask,
    private readonly browserProxyCrawlerTask: BrowserProxyCrawlerTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.TEST:
        return await this.testTask.exec();
      case SUB_COMMAND.BROWSER_PROXY_CRAWLER:
        return await this.browserProxyCrawlerTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
