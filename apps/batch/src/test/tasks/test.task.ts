import { groupBy } from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import {
  FinancialStatementRepository,
  StockReportRepository,
} from '@libs/domain';
import { ANALYZE_PORTFOLIO_PROMPT, ClaudeService } from '@libs/ai';

@Injectable()
export class TestTask {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  async exec(): Promise<void> {
    const reports = await this.stockReportRepo.find();
    for (const report of reports) {
      const financialStatements = await this.financialStatementRepo.find({
        where: { 회사명: report.stockName },
      });

      if (financialStatements.length === 0) {
        Logger.log('Financial Statements not found');
      }

      const mergedFinancialStatements = financialStatements.map((item) => {
        const { 유형, 결산기준일, 보고서종류 } = item;
        const record: Record<string, string> = { 유형, 결산기준일, 보고서종류 };
        item.항목들.map(({ 항목명, 항목값 }) => {
          if (항목값) {
            record[항목명] = 항목값;
          }
        });

        return record;
      });

      const { 현금흐름표, 손익계산서, 재무상태표 } = groupBy(
        mergedFinancialStatements,
        '유형',
      );

      const prompt = ANALYZE_PORTFOLIO_PROMPT.replace(
        '{{CASH_FLOW}}',
        JSON.stringify(현금흐름표),
      )
        .replace('{{PROFIT_AND_LOSS}}', JSON.stringify(손익계산서))
        .replace('{{BALANCE_SHEET}}', JSON.stringify(재무상태표));
      const response = await this.claudeService.invoke(prompt);

      console.log(report.stockName);
      console.log(response);
    }
  }
}
