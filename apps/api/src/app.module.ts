import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ReportModule } from './report';

@Module({
  imports: [CoreModule, ReportModule],
})
export class AppModule {}
