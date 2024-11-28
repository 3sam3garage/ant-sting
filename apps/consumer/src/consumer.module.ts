import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationModule } from './economic-information';
import { StockReportModule } from './stock-report';

@Module({
  imports: [CoreModule, EconomicInformationModule, StockReportModule],
})
export class ConsumerModule {}
