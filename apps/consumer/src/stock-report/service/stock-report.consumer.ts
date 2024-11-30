import { ObjectId } from 'mongodb';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import pdf from 'pdf-parse';
import { today } from '@libs/common';
import {
  CURRENCY_TYPE,
  MARKET_POSITION,
  MARKET_TYPE,
  StockAnalysis,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { ANALYZE_PDF_STOCK_REPORT_PROMPT, ClaudeService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_STOCK)
export class StockReportConsumer extends BaseConsumer {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly claudeService: ClaudeService,
  ) {
    super();
  }

  private parsePosition(text: string): MARKET_POSITION {
    const item = text?.toLowerCase();
    switch (true) {
      case item?.includes('buy'):
      case item?.includes('매수'):
        return MARKET_POSITION.BUY;
      case item?.includes('sell'):
      case item?.includes('매도'):
        return MARKET_POSITION.SELL;
      case item?.includes('maintain'):
      case item?.includes('nr'):
      case item?.includes('유지'):
      case item?.includes('hold'):
      case item?.includes('neutral'):
      case item?.includes('not rated'):
      case item?.includes('보유'):
      case item?.includes('없음'):
      case item?.includes('-'):
      case item?.includes('marketperform'):
      default:
        return MARKET_POSITION.HOLD;
    }
  }

  @Process({ concurrency: 3 })
  async run({ data: { stockReportId } }: Job<{ stockReportId: string }>) {
    const { uuid, file, stockName, date, code, market } =
      await this.stockReportRepo.findOne({
        where: { _id: new ObjectId(stockReportId) },
      });

    const isDupe = await this.stockAnalysisRepo.findOne({ where: { uuid } });
    if (isDupe) {
      Logger.error(`Duplicate action for ${uuid}`);
    }

    const pdfFile = await axios.get(file, { responseType: 'arraybuffer' });
    const data = await pdf(pdfFile.data, { max: 2 });

    const prompt = ANALYZE_PDF_STOCK_REPORT_PROMPT.replace(
      '{{TODAY}}',
      today(),
    ).replace('{{PDF_EXTRACTED_TEXT}}', data.text);

    const { targetPrice, currentPrice, position, currency, analysis } =
      await this.claudeService.invoke(prompt);

    const entity = StockAnalysis.create({
      uuid,
      stockCode: code,
      stockName,
      date,
      market,
      currency:
        market === MARKET_TYPE.KR
          ? CURRENCY_TYPE.KRW
          : (currency as CURRENCY_TYPE),
      price: typeof currentPrice === 'number' ? currentPrice : 0,
      reportAnalysis: {
        targetPrice: typeof targetPrice === 'number' ? targetPrice : 0,
        position: this.parsePosition(position),
      },
      aiAnalysis: {
        targetPrice:
          typeof analysis.targetPrice === 'number' ? analysis.targetPrice : 0,
        position: this.parsePosition(analysis.position),
        reason: analysis.reason,
      },
      stockReportId: new ObjectId(stockReportId),
    });

    await this.stockAnalysisRepo.save(entity);
  }
}
