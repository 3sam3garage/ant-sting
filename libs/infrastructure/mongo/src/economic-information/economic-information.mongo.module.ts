import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EconomicInformationRepository,
  EconomicInformationAnalysisRepository,
} from './repository';
import { EconomicInformation, EconomicInformationAnalysis } from './entity';
import { MONGO_REPOSITORY_TOKEN } from '@libs/application';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EconomicInformation,
      EconomicInformationAnalysis,
    ]),
  ],
  providers: [
    {
      provide: MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION,
      useClass: EconomicInformationRepository,
    },
    {
      provide: MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION_ANALYSIS,
      useClass: EconomicInformationAnalysisRepository,
    },
  ],
  exports: [
    MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION,
    MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION_ANALYSIS,
  ],
})
export class EconomicInformationMongoModule {}
