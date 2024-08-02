import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestReportRepository } from './repository';
import { InvestReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestReport])],
  providers: [InvestReportRepository],
  exports: [InvestReportRepository],
})
export class InvestReportDomainModule {}
