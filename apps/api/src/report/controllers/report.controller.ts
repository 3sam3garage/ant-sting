import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from '../services';
import { FindReportSummariesQuery } from '../dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // @Get('latest-7-days')
  // async findLatestDateWithReports(): Promise<string[]> {
  //   return this.reportService.figureLatest7Days();
  // }

  @Get()
  async findSummaries(@Query() query: FindReportSummariesQuery) {
    return this.reportService.findSummaries(query);
  }
}
