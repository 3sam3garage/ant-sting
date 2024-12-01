import { Command, CommandRunner } from 'nest-commander';
import {
  HanaStockReportsCrawler,
  KiwoomStockReportsCrawler,
  NaverStockReportsCrawler,
  ShinhanStockReportsCrawler,
} from '../tasks';

enum SUB_COMMAND {
  SCRAPE_NAVER = 'scrape-naver',
  SCRAPE_HANA = 'scrape-hana',
  SCRAPE_SHINHAN = 'scrape-shinhan',
  SCRAPE_KIWOOM = 'scrape-kiwoom',
}

@Command({ name: 'stock' })
export class StockCommand extends CommandRunner {
  constructor(
    private readonly naverStockReportsCrawler: NaverStockReportsCrawler,
    private readonly hanaStockReportsCrawler: HanaStockReportsCrawler,
    private readonly shinhanStockReportsCrawler: ShinhanStockReportsCrawler,
    private readonly kiwoomStockReportsCrawler: KiwoomStockReportsCrawler,
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
      case SUB_COMMAND.SCRAPE_SHINHAN:
        return await this.shinhanStockReportsCrawler.exec();
      case SUB_COMMAND.SCRAPE_KIWOOM:
        return await this.kiwoomStockReportsCrawler.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
