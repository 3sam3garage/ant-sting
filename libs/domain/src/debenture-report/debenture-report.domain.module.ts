import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebentureReportRepository } from './repository';
import { DebentureReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([DebentureReport])],
  providers: [DebentureReportRepository],
  exports: [DebentureReportRepository],
})
export class DebentureReportDomainModule {}
