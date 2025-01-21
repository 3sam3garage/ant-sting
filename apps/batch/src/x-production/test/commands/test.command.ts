import { Command, CommandRunner } from 'nest-commander';
import {
  AddRealtimeShortMessageService,
  BrowserProxyCrawlerTask,
  MacroAnalysisDraft,
} from '../tasks';

enum SUB_COMMAND {
  MACRO_ANALYSIS_DRAFT = 'macro-analysis-draft',
  ADD_REALTIME_SHORT_MESSAGE = 'add-realtime-short-message',
  BROWSER_PROXY_CRAWLER = 'browser-proxy-crawler',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(
    private readonly macroAnalysisDraft: MacroAnalysisDraft,
    private readonly browserProxyCrawlerTask: BrowserProxyCrawlerTask,
    private readonly addRealtimeShortMessageService: AddRealtimeShortMessageService,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.ADD_REALTIME_SHORT_MESSAGE:
        return await this.addRealtimeShortMessageService.exec();
      case SUB_COMMAND.MACRO_ANALYSIS_DRAFT:
        return await this.macroAnalysisDraft.exec();
      case SUB_COMMAND.BROWSER_PROXY_CRAWLER:
        return await this.browserProxyCrawlerTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
