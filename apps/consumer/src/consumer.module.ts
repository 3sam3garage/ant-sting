import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ScoreReportModule } from './score-report';

@Module({
  imports: [CoreModule, ScoreReportModule],
})
export class ConsumerModule {}
