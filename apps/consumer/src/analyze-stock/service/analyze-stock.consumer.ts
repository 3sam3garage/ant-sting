import { ObjectId } from 'typeorm';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  FinancialStatement,
  FinancialStatementRepository,
  StockAnalysis,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import {
  ExternalApiConfigService,
  GOV_STOCK_INFO_URL,
  QUEUE_NAME,
} from '@libs/config';
import { ANALYZE_STOCK_REPORT_PROMPT, ClaudeService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';
import { groupBy } from 'lodash';
import { omitIsNil, retry } from '@libs/common';
import axios from 'axios';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_NAME.ANALYZE_STOCK)
export class AnalyzeStockConsumer extends BaseConsumer {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly claudeService: ClaudeService,
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {
    super();
  }

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
   * stock-report-detail consumer 에서 호출
   * @param data
   */
  @Process({ concurrency: 1 })
  async run({ data }: Job<{ _id: string }>) {
    const { code, stockName, nid, summary, targetPrice, position } =
      await this.stockReportRepo.findOneById(new ObjectId(data._id));
    const isDupe = await this.stockAnalysisRepo.findOne({ where: { nid } });
    if (isDupe) {
      Logger.error(`Duplicate action for ${nid}`);
    }

    const financialStatements = await this.financialStatementRepo.find({
      where: { 종목코드: code },
    });
    const stockPrice = await this.figureLatestStockPrice(stockName);
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
      nid: nid,
      price: stockPrice,
      stockCode: code,
      reportAnalysis: { targetPrice, position },
      aiAnalysis: analysis,
      ...financialStatementInfo,
    });
    await this.stockAnalysisRepo.save(entity);
  }
}
