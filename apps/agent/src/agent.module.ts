import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FilingModule } from './filing';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CoreModule, ScheduleModule.forRoot(), FilingModule],
  controllers: [],
  providers: [],
})
export class AgentModule {}
