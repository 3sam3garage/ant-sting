import { Command, CommandRunner } from 'nest-commander';
import { StockMarketNewsListScraper } from '../tasks';

enum SUB_COMMAND {
  SCRAPE_LIST = 'scrape-list',
}

@Command({ name: 'stock-market-news' })
export class StockMarketNewsCommand extends CommandRunner {
  constructor(
    private readonly stockMarketNewsListScraper: StockMarketNewsListScraper,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SCRAPE_LIST:
        return await this.stockMarketNewsListScraper.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
