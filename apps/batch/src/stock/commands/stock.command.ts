import { Command, CommandRunner } from 'nest-commander';
import { ScrapeStockReportsCrawler } from '../tasks';

enum SUB_COMMAND {
  // 종목 분석 리포트 수집
  SCRAPE = 'scrape',
}

@Command({ name: 'stock' })
export class StockCommand extends CommandRunner {
  constructor(
    private readonly scrapeStockReportCrawler: ScrapeStockReportsCrawler,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SCRAPE:
        return await this.scrapeStockReportCrawler.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
