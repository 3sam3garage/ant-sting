import { Command, CommandRunner } from 'nest-commander';
import { CorporationUpdateIdTask, FinancialStatementTask } from '../tasks';

enum SUB_COMMAND {
  // 기업 공시 ID 정보 업데이트
  UPDATE_ID = 'update-id',
  // 재무 정보
  FINANCIAL_STATEMENT = 'financial-statement',
}

@Command({ name: 'corporation' })
export class CorporationCommand extends CommandRunner {
  constructor(
    private readonly corporationUpdateIdTask: CorporationUpdateIdTask,
    private readonly financialStatementTask: FinancialStatementTask,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const [subcommand] = passedParam;

    switch (subcommand) {
      case SUB_COMMAND.UPDATE_ID:
        return await this.corporationUpdateIdTask.exec();
      case SUB_COMMAND.FINANCIAL_STATEMENT:
        return await this.financialStatementTask.exec();
      default:
        throw new Error('Invalid subcommand');
    }
  }
}
