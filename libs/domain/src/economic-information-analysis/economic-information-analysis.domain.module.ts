import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomicInformationAnalysisRepository } from './repository';
import { EconomicInformationAnalysis } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([EconomicInformationAnalysis])],
  providers: [EconomicInformationAnalysisRepository],
  exports: [EconomicInformationAnalysisRepository],
})
export class EconomicInformationAnalysisDomainModule {}
