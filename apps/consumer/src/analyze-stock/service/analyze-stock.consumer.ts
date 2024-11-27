import { groupBy } from 'lodash';
import { ObjectId } from 'mongodb';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  FinancialStatement,
  FinancialStatementAnalysis,
  FinancialStatementRepository,
  MARKET_TYPE,
  StockAnalysis,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { DataGovApiService } from '@libs/external-api';
import { ANALYZE_STOCK_REPORT_PROMPT, ClaudeService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_STOCK)
export class AnalyzeStockConsumer extends BaseConsumer {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly claudeService: ClaudeService,
    private readonly dataGovApiService: DataGovApiService,
  ) {
    super();
  }

  private groupFinancialStatementsByType(
    financialStatements: FinancialStatement[],
  ) {
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

    return { 현금흐름표, 손익계산서, 재무상태표 };
  }

  /**
   * scrape-stock-report consumer 에서 호출
   * @param data
   */
  @Process({ concurrency: 2 })
  async run({ data: { stockReportId } }: Job<{ stockReportId: string }>) {
    const { code, stockName, uuid, summary, targetPrice, position, date } =
      await this.stockReportRepo.findOneById(new ObjectId(stockReportId));
    const isDupe = await this.stockAnalysisRepo.findOne({ where: { uuid } });
    if (isDupe) {
      Logger.error(`Duplicate action for ${uuid}`);
    }

    const financialStatements = await this.financialStatementRepo.find({
      where: { 종목코드: code },
    });
    const stockPrice =
      await this.dataGovApiService.getLatestStockPrice(stockName);
    const { 현금흐름표, 손익계산서, 재무상태표 } =
      this.groupFinancialStatementsByType(financialStatements);

    const prompt = ANALYZE_STOCK_REPORT_PROMPT.replace(
      '{{CURRENT_PRICE}}',
      `${stockPrice}`,
    )
      .replace('{{REPORT_SUMMARY}}', summary)
      .replace('{{CASH_FLOW}}', JSON.stringify(현금흐름표))
      .replace('{{PROFIT_AND_LOSS}}', JSON.stringify(손익계산서))
      .replace('{{BALANCE_SHEET}}', JSON.stringify(재무상태표));

    const { analysis, ...financialStatementInfo } =
      await this.claudeService.invoke(prompt, {
        temperature: 0.1,
      });

    const entity = StockAnalysis.create({
      stockName,
      date,
      uuid,
      price: stockPrice,
      stockCode: code,
      reportAnalysis: { targetPrice, position },
      aiAnalysis: analysis,
      financialStatement: financialStatementInfo as FinancialStatementAnalysis,
      market: MARKET_TYPE.KR,
    });
    await this.stockAnalysisRepo.save(entity);
  }
}
