import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationModule } from './economic-information';
import { StockReportModule } from './stock-report';
import { FilingModule } from './filing';
import { ShortInterestModule } from './short-interest';
import { NewsModule } from './news';

@Module({
  imports: [
    CoreModule,
    EconomicInformationModule,
    StockReportModule,
    FilingModule,
    ShortInterestModule,
    NewsModule,
  ],
})
export class ConsumerModule {}
