import { Command, CommandRunner } from 'nest-commander';
import {
  MacroEnvironmentCrawlerTask,
  RecommendPortfolioTask,
  StockReportCrawlerTask,
  SummarizeMacroEnvironmentNewsTask,
} from '../tasks';

enum SUB_COMMAND {
  // 거시 환경 정보 수집
  MACRO_ENVIRONMENT = 'macro-environment',
  // 종목 분석 리포트 수집
  STOCK = 'stock',
  // 거시환경 경제 정보 요약
  SUMMARIZE_MACRO_ENVIRONMENT = 'summarize-macro-environment-news',
  // 포트폴리오 리포트 추천
  RECOMMEND_PORTFOLIO = 'recommend-portfolio',
}

@Command({ name: 'report' })
export class ReportCrawlerCommand extends CommandRunner {
  constructor(
    private readonly macroEnvironmentCrawlerTask: MacroEnvironmentCrawlerTask,
    private readonly stockReportCrawlerTask: StockReportCrawlerTask,
    private readonly summarizeMacroEnvironmentTask: SummarizeMacroEnvironmentNewsTask,
    private readonly recommendPortfolioTask: RecommendPortfolioTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.SUMMARIZE_MACRO_ENVIRONMENT:
        return await this.summarizeMacroEnvironmentTask.exec();
      case SUB_COMMAND.RECOMMEND_PORTFOLIO:
        return await this.recommendPortfolioTask.exec();
      case SUB_COMMAND.MACRO_ENVIRONMENT:
        return await this.macroEnvironmentCrawlerTask.exec();
      case SUB_COMMAND.STOCK:
        return await this.stockReportCrawlerTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
