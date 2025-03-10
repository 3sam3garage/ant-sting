import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { FilingModule } from './filing';
import { ScheduleModule } from '@nestjs/schedule';
// import { ShortInterestModule } from './short-interest';

@Module({
  imports: [
    CoreModule,
    ScheduleModule.forRoot(),
    FilingModule,
    // ShortInterestModule,
  ],
  controllers: [],
  providers: [],
})
export class AgentModule {}
