import { Command, CommandRunner } from 'nest-commander';
import {
  AddRealtimeShortMessageService,
  RealtimeShortInterestCrawler,
  MacroAnalysisDraft,
} from '../tasks';

enum SUB_COMMAND {
  MACRO_ANALYSIS_DRAFT = 'macro-analysis-draft',

  // 큐에 메시지 추가
  ADD_REALTIME_SHORT_MESSAGE = 'add-realtime-short-message',

  // poc
  REALTIME_SHORT_INTEREST = 'realtime-short-interest-crawler',
}

@Command({ name: 'test' })
export class TestCommand extends CommandRunner {
  constructor(
    private readonly macroAnalysisDraft: MacroAnalysisDraft,
    private readonly realtimeShortInterestCrawler: RealtimeShortInterestCrawler,
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
      case SUB_COMMAND.REALTIME_SHORT_INTEREST:
        return await this.realtimeShortInterestCrawler.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
