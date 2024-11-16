import { Command, CommandRunner } from 'nest-commander';
import {
  ScrapeEconomicInformationCrawler,
  PackageEconomicInformationTask,
} from '../tasks';

enum SUB_COMMAND {
  // 거시 환경 정보 수집
  SCRAPE = 'scrape',
  // 경제 정보 요약 및 패키지화하여 전달
  PACKAGE = 'package',
}

@Command({ name: 'economic-information' })
export class EconomicInformationCommand extends CommandRunner {
  constructor(
    private readonly scrapeMacroEnvironmentCrawler: ScrapeEconomicInformationCrawler,
    private readonly packageEconomicInformationTask: PackageEconomicInformationTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.PACKAGE:
        return await this.packageEconomicInformationTask.exec();
      case SUB_COMMAND.SCRAPE:
        return await this.scrapeMacroEnvironmentCrawler.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
