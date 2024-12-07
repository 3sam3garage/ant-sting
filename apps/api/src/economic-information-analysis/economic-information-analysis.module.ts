import { Module } from '@nestjs/common';
import { EconomicInformationDomainModule } from '@libs/domain';
import { EconomicInformationAnalysisController } from './controllers';
import { EconomicInformationAnalysisService } from './services';

@Module({
  imports: [EconomicInformationDomainModule, EconomicInformationDomainModule],
  controllers: [EconomicInformationAnalysisController],
  providers: [EconomicInformationAnalysisService],
})
export class EconomicInformationAnalysisModule {}
