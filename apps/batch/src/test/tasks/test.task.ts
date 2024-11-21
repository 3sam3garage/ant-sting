import { Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysisRepository,
  FinancialStatementRepository,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { ClaudeService } from '@libs/ai';
import { DataGovApiService, SlackService } from '@libs/external-api';

@Injectable()
export class TestTask {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly economicInfoAnalysisRepo: EconomicInformationAnalysisRepository,
    private readonly claudeService: ClaudeService,
    private readonly dataGovApiService: DataGovApiService,
    private readonly slackService: SlackService,
  ) {}

  async exec(): Promise<void> {
    console.log(12345);
  }
}
