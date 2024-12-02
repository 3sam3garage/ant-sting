import { Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysisRepository,
  FinancialStatementRepository,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { ClaudeService } from '@libs/ai';
import { DataGovApiService, SlackService } from '@libs/external-api';
import { countBy } from 'lodash';

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
    const analysis = await this.stockAnalysisRepo.find({ date: '2024-11-29' });

    const group = countBy(analysis, 'uuid');

    console.log(group);
    for (const [uuid, count] of Object.entries(group)) {
      if (count >= 2) {
        await this.stockAnalysisRepo.deleteOne({ uuid });
      }
    }
  }
}
