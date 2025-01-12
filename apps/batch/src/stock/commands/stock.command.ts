import { Command, CommandRunner } from 'nest-commander';
import { SecTickerFetcher } from '../tasks';

enum SUB_COMMAND {
  SCRAPE_SEC_TICKER = 'scrape-sec-ticker',
}

@Command({ name: 'stock' })
export class StockCommand extends CommandRunner {
  constructor(private readonly secTickerFetcher: SecTickerFetcher) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SCRAPE_SEC_TICKER:
        return await this.secTickerFetcher.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
