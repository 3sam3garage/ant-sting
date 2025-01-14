import { Command, CommandRunner } from 'nest-commander';
import { ScrapeRssFetcher, SecTickerFetcher } from '../tasks';

enum SUB_COMMAND {
  // SEC company_ticker.json 수집
  SCRAPE_SEC_TICKER = 'scrape-sec-ticker',
  // 오늘 filing 이 발행된 종목 찾기
  SCRAPE_RSS = 'scrape-rss',
}

@Command({ name: 'stock' })
export class StockCommand extends CommandRunner {
  constructor(
    private readonly secTickerFetcher: SecTickerFetcher,
    private readonly figureStockIssuedTodayService: ScrapeRssFetcher,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SCRAPE_SEC_TICKER:
        return await this.secTickerFetcher.exec();
      case SUB_COMMAND.SCRAPE_RSS:
        return await this.figureStockIssuedTodayService.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
