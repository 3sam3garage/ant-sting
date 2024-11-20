import { groupBy } from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import {
  FinancialStatementRepository,
  MARKET_POSITION,
  StockAnalysis,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { ANALYZE_STOCK_REPORT_PROMPT, ClaudeService } from '@libs/ai';
import {
  DataGovApiService,
  SlackMessage,
  SlackMessageBlock,
  SlackService,
} from '@libs/external-api';
import { news } from './constants';

@Injectable()
export class TestTask {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly claudeService: ClaudeService,
    private readonly dataGovApiService: DataGovApiService,
    private readonly slackService: SlackService,
  ) {}

  private async stockAnalysis() {
    const reports = await this.stockReportRepo.find();
    for (const report of reports) {
      const financialStatements = await this.financialStatementRepo.find({
        where: { 종목코드: report.code },
      });

      if (financialStatements.length === 0) {
        Logger.log('Financial Statements not found');
      }

      const stockPrice = await this.dataGovApiService.getLatestStockPrice(
        report.stockName,
      );

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

  /**
   * message builder 적극 이용하자
   * https://app.slack.com/block-kit-builder
   */
  private async slackSendDailyDigest() {
    const { questions, insights, terminologies, summaries, strategies } = news;

    const summaryElements = summaries.map((summary) => {
      return {
        type: 'rich_text_section',
        elements: [{ type: 'text', text: summary, style: { bold: true } }],
      };
    }) as SlackMessageBlock[];
    const insightsElements = insights.map((summary) => {
      return {
        type: 'rich_text_section',
        elements: [{ type: 'text', text: summary, style: { bold: true } }],
      };
    }) as SlackMessageBlock[];
    const termsElements = terminologies.map((term) => {
      return {
        type: 'rich_text_section',
        elements: [{ type: 'text', text: term }],
      };
    }) as SlackMessageBlock[];
    const questionsElements = questions.map(({ question, answer }) => {
      return {
        type: 'rich_text_quote',
        elements: [
          { type: 'text', text: `Q. ${question}`, style: { bold: true } },
          { type: 'text', text: '\n' },
          { type: 'text', text: `A. ${answer}` },
          { type: 'text', text: '\n\n' },
        ],
      };
    }) as SlackMessageBlock[];
    const strategyElements = strategies.map(({ action, reason }) => {
      return {
        type: 'rich_text_quote',
        elements: [
          { type: 'text', text: `- ${action}`, style: { bold: true } },
          { type: 'text', text: '\n' },
          { type: 'text', text: `${reason}` },
          { type: 'text', text: '\n\n' },
        ],
      };
    }) as SlackMessageBlock[];

    const message: SlackMessage = {
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Daily digest' },
        },
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_list',
              style: 'bullet',
              elements: summaryElements,
            },
          ],
        },
        { type: 'divider' },
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Insights' },
        },
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_list',
              style: 'bullet',
              elements: insightsElements,
            },
          ],
        },
        { type: 'divider' },
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Questions you might have...' },
        },
        {
          type: 'rich_text',
          elements: questionsElements,
        },
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Market Strategy' },
        },
        {
          type: 'rich_text',
          elements: strategyElements,
        },
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Terminology' },
        },
        {
          type: 'rich_text',
          elements: [
            {
              type: 'rich_text_list',
              style: 'bullet',
              elements: termsElements,
            },
          ],
        },
      ],
    };

    const response = await this.slackService.sendMessage(message);

    return response;
  }

  private async slackSendStockAnalysis() {
    const anlaysis = await this.stockAnalysisRepo.find({
      where: {
        'reportAnalysis.position': MARKET_POSITION.BUY,
        'aiAnalysis.position': MARKET_POSITION.BUY,
      },
    });

    console.log(1);
  }

  async exec(): Promise<void> {
    await this.slackSendStockAnalysis();
  }
}
