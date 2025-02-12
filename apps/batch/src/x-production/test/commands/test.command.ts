import { Command, CommandRunner } from 'nest-commander';
import {
  AddRealtimeShortMessageService,
  MacroAnalysisDraft,
  ProxyFetcher,
} from '../tasks';

enum SUB_COMMAND {
  MACRO_ANALYSIS_DRAFT = 'macro-analysis-draft',

  // 큐에 메시지 추가
  ADD_REALTIME_SHORT_MESSAGE = 'add-realtime-short-message',

  PROXY_FETCHER = 'proxy-fetcher',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(
    private readonly macroAnalysisDraft: MacroAnalysisDraft,
    private readonly addRealtimeShortMessageService: AddRealtimeShortMessageService,
    private readonly proxyFetcher: ProxyFetcher,
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
      case SUB_COMMAND.PROXY_FETCHER:
        return await this.proxyFetcher.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
