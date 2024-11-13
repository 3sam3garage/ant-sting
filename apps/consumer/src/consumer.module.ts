import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ScoreReportModule } from './score-report';
import { MacroEnvironmentModule } from './macro-environment';

@Module({
  imports: [CoreModule, ScoreReportModule, MacroEnvironmentModule],
})
export class ConsumerModule {}
