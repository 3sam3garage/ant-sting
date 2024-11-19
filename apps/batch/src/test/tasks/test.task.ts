import { groupBy } from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import {
  FinancialStatementRepository,
  StockReportRepository,
} from '@libs/domain';
import { ANALYZE_STOCK_REPORT_PROMPT, ClaudeService } from '@libs/ai';
import { omitIsNil, retry } from '@libs/common';
import { ExternalApiConfigService } from '@libs/config';
import axios from 'axios';

const GOV_STOCK_INFO_URL =
  'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';

@Injectable()
export class TestTask {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly claudeService: ClaudeService,
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}

  private async figureLatestStockPrice(stockName: string): Promise<number> {
    const params = omitIsNil({
      serviceKey: this.externalApiConfigService.dataGoServiceKey,
      resultType: 'json',
      numOfRows: 1,
      itmsNm: stockName.trim(),
      basDt: null,
    });
    const stockInfo = await retry(
      () => axios.get(GOV_STOCK_INFO_URL, { params }),
      3,
    );
    const [item] = stockInfo.data.response.body.items.item;

    return +item?.mkp || 0;
  }

  async exec(): Promise<void> {
    const reports = await this.stockReportRepo.find();
    for (const report of reports) {
      const financialStatements = await this.financialStatementRepo.find({
        where: { 종목코드: report.code },
      });

      if (financialStatements.length === 0) {
        Logger.log('Financial Statements not found');
      }

      const stockPrice = await this.figureLatestStockPrice(report.stockName);

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

      const prompt = ANALYZE_STOCK_REPORT_PROMPT.replace(
        '{{CURRENT_PRICE}}',
        `${stockPrice}`,
      )
        .replace('{{REPORT_SUMMARY}}', report.summary)
        .replace('{{CASH_FLOW}}', JSON.stringify(현금흐름표))
        .replace('{{PROFIT_AND_LOSS}}', JSON.stringify(손익계산서))
        .replace('{{BALANCE_SHEET}}', JSON.stringify(재무상태표));
      const response = await this.claudeService.invoke(prompt, {
        temperature: 0.1,
      });

      console.log(report.stockName);
      console.log(response);
    }
  }
}
