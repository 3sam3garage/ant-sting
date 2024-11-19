import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { StockReportDetailModule } from './stock-report-detail';
import { EconomicInformationModule } from './economic-information';
import { AnalyzeStockModule } from './analyze-stock';

@Module({
  imports: [
    CoreModule,
    StockReportDetailModule,
    EconomicInformationModule,
    AnalyzeStockModule,
  ],
})
export class ConsumerModule {}
