import { Command, CommandRunner } from 'nest-commander';
import {
  NaverEconomicInformationCrawler,
  AnalyzeEconomicInformationTask,
  KcifEconomicInformationCrawler,
  ExchangeRateFetcher,
  BondYieldFetcher,
} from '../tasks';

enum SUB_COMMAND {
  // 거시 환경 정보 수집 - 네이버
  SCRAPE_NAVER = 'scrape-naver',
  // 거시 환경 정보 수집 - kcif(국제금융센터)
  SCRAPE_KCIF = 'scrape-kcif',
  // 경제 정보 요약 및 패키지화하여 전달
  ANALYZE = 'analyze',

  // 주요국 환율
  EXCHANGE_RATE = 'exchange-rate',
  // 채권 금리(수익률)
  BOND_YIELD = 'bond-yield',
}

@Command({ name: 'economic-information' })
export class EconomicInformationCommand extends CommandRunner {
  constructor(
    private readonly naverEconomicInformationCrawler: NaverEconomicInformationCrawler,
    private readonly kcifEconomicInformationCrawler: KcifEconomicInformationCrawler,
    private readonly analyzeEconomicInformationTask: AnalyzeEconomicInformationTask,
    private readonly exchangeRateFetcher: ExchangeRateFetcher,
    private readonly bondYieldFetcher: BondYieldFetcher,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.ANALYZE:
        return await this.analyzeEconomicInformationTask.exec();
      case SUB_COMMAND.SCRAPE_NAVER:
        return await this.naverEconomicInformationCrawler.exec();
      case SUB_COMMAND.SCRAPE_KCIF:
        return await this.kcifEconomicInformationCrawler.exec();
      case SUB_COMMAND.EXCHANGE_RATE:
        return await this.exchangeRateFetcher.exec();
      case SUB_COMMAND.BOND_YIELD:
        return await this.bondYieldFetcher.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
