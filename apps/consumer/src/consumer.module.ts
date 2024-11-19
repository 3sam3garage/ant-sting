import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ReportSummaryModule } from './report-summary';
import { EconomicInformationModule } from './economic-information';

@Module({
  imports: [CoreModule, ReportSummaryModule, EconomicInformationModule],
})
export class ConsumerModule {}
