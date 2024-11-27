import { ObjectId } from 'mongodb';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import pdf from 'pdf-parse';
import { today } from '@libs/common';
import {
  CURRENCY_TYPE,
  ForeignStockReportRepository,
  StockAnalysis,
  StockAnalysisRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { ANALYZE_PDF_STOCK_REPORT_PROMPT, ClaudeService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.ANALYZE_STOCK_PDF)
export class AnalyzeHanaStockConsumer extends BaseConsumer {
  constructor(
    private readonly foreignStockReportRepo: ForeignStockReportRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly claudeService: ClaudeService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { stockReportId } }: Job<{ stockReportId: string }>) {
    const { uuid, file, stockName, date, code, market } =
      await this.foreignStockReportRepo.findOne({
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
      currency: currency as CURRENCY_TYPE,
      price: currentPrice,
      reportAnalysis: { targetPrice, position },
      aiAnalysis: {
        targetPrice: analysis.targetPrice,
        position: analysis.position,
        reason: analysis.reason,
      },
    });

    await this.stockAnalysisRepo.save(entity);
  }
}
