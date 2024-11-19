import { Module } from '@nestjs/common';
import {
  FinancialStatementDomainModule,
  StockAnalysisDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { AiModule } from '@libs/ai';
import { AnalyzeStockConsumer } from './service';

@Module({
  imports: [
    StockAnalysisDomainModule,
    FinancialStatementDomainModule,
    StockReportDomainModule,
    AiModule,
  ],
  providers: [AnalyzeStockConsumer],
})
export class AnalyzeStockModule {}
