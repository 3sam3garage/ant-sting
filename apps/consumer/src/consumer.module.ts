import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationModule } from './economic-information';
import { StockReportModule } from './stock-report';
import { FilingModule } from './filing';
import { ShortInterestModule } from './short-interest';

@Module({
  imports: [
    CoreModule,
    EconomicInformationModule,
    StockReportModule,
    FilingModule,
    ShortInterestModule,
  ],
})
export class ConsumerModule {}
