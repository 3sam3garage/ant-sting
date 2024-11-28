import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EconomicInformationRepository,
  EconomicInformationAnalysisRepository,
} from './repository';
import { EconomicInformation, EconomicInformationAnalysis } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EconomicInformation,
      EconomicInformationAnalysis,
    ]),
  ],
  providers: [
    EconomicInformationRepository,
    EconomicInformationAnalysisRepository,
  ],
  exports: [
    EconomicInformationRepository,
    EconomicInformationAnalysisRepository,
  ],
})
export class EconomicInformationDomainModule {}
