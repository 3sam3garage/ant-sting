import { Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysisRepository,
  FinancialStatementRepository,
  HANA_BASE_URL,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { ClaudeService } from '@libs/ai';
import { DataGovApiService, SlackService } from '@libs/external-api';
import { joinUrl } from '@libs/common';

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
    // const stockReports = await this.stockReportRepo.find();
    //
    // for (const stock-report of stockReports) {
    //   const nid = new URL(joinUrl(HANA_BASE_URL, stock-report.detailUrl)).searchParams
    //     .get('nid')
    //     ?.trim();
    //
    //   await this.stockReportRepo.save({ ...stock-report, uuid: `naver:${nid}` });
    // }
  }
}
