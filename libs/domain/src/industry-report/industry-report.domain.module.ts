import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustryReportRepository } from './repository';
import { IndustryReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustryReport])],
  providers: [IndustryReportRepository],
  exports: [IndustryReportRepository],
})
export class IndustryReportDomainModule {}
