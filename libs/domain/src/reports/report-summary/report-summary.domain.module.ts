import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSummaryRepository } from './repository';
import { ReportSummary } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportSummary])],
  providers: [ReportSummaryRepository],
  exports: [ReportSummaryRepository],
})
export class ReportSummaryDomainModule {}
