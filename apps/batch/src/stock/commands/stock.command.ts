import { Command, CommandRunner } from 'nest-commander';
import { HanaStockReportsCrawler, NaverStockReportsCrawler } from '../tasks';

enum SUB_COMMAND {
  SCRAPE_NAVER = 'scrape-naver',
  SCRAPE_HANA = 'scrape-hana',
  SCRAPE_SHINHAN = 'scrape-shinhan',
}

@Command({ name: 'stock' })
export class StockCommand extends CommandRunner {
  constructor(
    private readonly naverStockReportsCrawler: NaverStockReportsCrawler,
    private readonly hanaStockReportsCrawler: HanaStockReportsCrawler,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SCRAPE_NAVER:
        return await this.naverStockReportsCrawler.exec();
      case SUB_COMMAND.SCRAPE_HANA:
        return await this.hanaStockReportsCrawler.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
