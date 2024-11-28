import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { StockReportController } from './controllers';
import { StockReportService } from './services';

@Module({
  imports: [EconomicInformationDomainModule, StockReportDomainModule],
  controllers: [StockReportController],
  providers: [StockReportService],
})
export class StockReportModule {}
