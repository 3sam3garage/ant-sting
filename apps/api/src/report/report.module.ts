import { Module } from '@nestjs/common';
import {
  MacroEnvironmentDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { StockReportController } from './controllers';
import { StockReportService } from './services';

@Module({
  imports: [MacroEnvironmentDomainModule, StockReportDomainModule],
  controllers: [StockReportController],
  providers: [StockReportService],
})
export class ReportModule {}
