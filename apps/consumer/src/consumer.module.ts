import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ScoreReportModule } from './score-report';
import { EconomicInformationModule } from './economic-information';

@Module({
  imports: [CoreModule, ScoreReportModule, EconomicInformationModule],
})
export class ConsumerModule {}
