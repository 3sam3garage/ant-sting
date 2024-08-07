import { Command, CommandRunner } from 'nest-commander';
import { DailyInvestReportEvaluationTask } from '../tasks';

enum SUB_COMMAND {
  // summary 종합하여 일간 리포트 요약
  DAILY_INVEST = 'daily-invest',
}

@Command({ name: 'report-evaluation' })
export class ReportEvaluationCommand extends CommandRunner {
  constructor(
    private readonly dailyInvestReportSummaryTask: DailyInvestReportEvaluationTask,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.DAILY_INVEST:
        return await this.dailyInvestReportSummaryTask.exec();
      default:
        throw new Error('서브커맨드가 입력되지 않았습니다.');
    }
  }
}
