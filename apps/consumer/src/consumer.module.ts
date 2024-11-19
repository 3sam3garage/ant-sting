import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ScrapeStockReportModule } from './scrape-stock-report';
import { EconomicInformationModule } from './economic-information';
import { AnalyzeStockModule } from './analyze-stock';

@Module({
  imports: [
    CoreModule,
    ScrapeStockReportModule,
    EconomicInformationModule,
    AnalyzeStockModule,
  ],
})
export class ConsumerModule {}
