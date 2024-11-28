import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { StockAnalysisController } from './controllers';
import { StockAnalysisService } from './services';

@Module({
  imports: [EconomicInformationDomainModule, StockReportDomainModule],
  controllers: [StockAnalysisController],
  providers: [StockAnalysisService],
})
export class StockAnalysisModule {}
