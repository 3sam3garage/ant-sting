import { Module } from '@nestjs/common';
import {
  FinancialStatementDomainModule,
  StockAnalysisDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { AiModule } from '@libs/ai';
import { ExternalApiModule } from '@libs/external-api';
import { AnalyzeStockConsumer } from './service';

@Module({
  imports: [
    StockAnalysisDomainModule,
    FinancialStatementDomainModule,
    StockReportDomainModule,
    AiModule,
    ExternalApiModule,
  ],
  providers: [AnalyzeStockConsumer],
})
export class AnalyzeStockModule {}
