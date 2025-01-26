import { Command, CommandRunner } from 'nest-commander';
import {
  RealtimeShortInterestCrawler,
  MacroAnalysisDraft,
  StockNewsCrawler,
} from '../tasks';

enum SUB_COMMAND {
  MACRO_ANALYSIS_DRAFT = 'macro-analysis-draft',

  // browser
  REALTIME_SHORT_INTEREST = 'realtime-short-interest-crawler',
  STOCK_NEWS = 'stock-news-crawler',
}

@Command({ name: 'poc' })
export class PocCommand extends CommandRunner {
  constructor(
    private readonly macroAnalysisDraft: MacroAnalysisDraft,
    private readonly realtimeShortInterestCrawler: RealtimeShortInterestCrawler,
    private readonly stockNewsCrawlerTask: StockNewsCrawler,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.MACRO_ANALYSIS_DRAFT:
        return await this.macroAnalysisDraft.exec();
      case SUB_COMMAND.REALTIME_SHORT_INTEREST:
        return await this.realtimeShortInterestCrawler.exec();
      case SUB_COMMAND.STOCK_NEWS:
        return await this.stockNewsCrawlerTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
