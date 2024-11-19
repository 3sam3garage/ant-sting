import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAnalysisRepository } from './repository';
import { StockAnalysis } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockAnalysis])],
  providers: [StockAnalysisRepository],
  exports: [StockAnalysisRepository],
})
export class StockAnalysisDomainModule {}
