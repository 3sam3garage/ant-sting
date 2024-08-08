import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomyReportRepository } from './repository';
import { EconomyReport } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([EconomyReport])],
  providers: [EconomyReportRepository],
  exports: [EconomyReportRepository],
})
export class EconomyReportDomainModule {}
