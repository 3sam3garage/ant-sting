import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockReport, StockAnalysis } from './entity';
import { StockReportRepository, StockAnalysisRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([StockReport, StockAnalysis])],
  providers: [StockReportRepository, StockAnalysisRepository],
  exports: [StockReportRepository, StockAnalysisRepository],
})
export class StockReportDomainModule {}
