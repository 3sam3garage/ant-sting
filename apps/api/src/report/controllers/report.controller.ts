import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindReportSummariesQuery } from '../dto';
import { ReportService } from '../services';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async findSummaries(@Query() query: FindReportSummariesQuery) {
    return this.reportService.findSummaries(query);
  }
}
