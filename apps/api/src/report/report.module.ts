import { Module } from '@nestjs/common';
import {
  DebentureReportDomainModule,
  EconomyReportDomainModule,
  IndustryReportDomainModule,
  InvestReportDomainModule,
  MarketInfoReportDomainModule,
  ReportSummaryDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import {
  ReportController,
  DebentureReportController,
  EconomyReportController,
  IndustryReportController,
  InvestReportController,
  StockReportController,
  MarketInfoReportController,
} from './controllers';
import {
  ReportService,
  DebentureReportService,
  EconomyReportService,
  IndustryReportService,
  InvestReportService,
  StockReportService,
  MarketInfoReportService,
} from './services';

@Module({
  imports: [
    DebentureReportDomainModule,
    EconomyReportDomainModule,
    IndustryReportDomainModule,
    InvestReportDomainModule,
    MarketInfoReportDomainModule,
    StockReportDomainModule,
    // summary
    ReportSummaryDomainModule,
  ],
  controllers: [
    ReportController,
    DebentureReportController,
    EconomyReportController,
    IndustryReportController,
    InvestReportController,
    StockReportController,
    MarketInfoReportController,
  ],
  providers: [
    ReportService,
    DebentureReportService,
    EconomyReportService,
    IndustryReportService,
    InvestReportService,
    StockReportService,
    MarketInfoReportService,
  ],
})
export class ReportModule {}
