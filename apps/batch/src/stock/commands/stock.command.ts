import { Command, CommandRunner } from 'nest-commander';
import { SecTickerFetcher, FinraShortInterestScraper } from '../tasks';

enum SUB_COMMAND {
  // SEC company_ticker.json 수집
  SCRAPE_SEC_TICKER = 'scrape-sec-ticker',

  // FINRA short_interest 수집
  SCRAPE_SHORT_INTEREST = 'scrape-finra-short-interest',
}

@Command({ name: 'stock' })
export class StockCommand extends CommandRunner {
  constructor(
    private readonly secTickerFetcher: SecTickerFetcher,
    private readonly finraShortInterestScraper: FinraShortInterestScraper,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SCRAPE_SEC_TICKER:
        return await this.secTickerFetcher.exec();
      case SUB_COMMAND.SCRAPE_SHORT_INTEREST:
        return await this.finraShortInterestScraper.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
