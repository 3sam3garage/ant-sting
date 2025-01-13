import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationModule } from './economic-information';
import { StockReportModule } from './stock-report';
import { FilingModule } from './filing';

@Module({
  imports: [
    CoreModule,
    EconomicInformationModule,
    StockReportModule,
    FilingModule,
  ],
})
export class ConsumerModule {}
