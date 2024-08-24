import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InvestReportService } from '../services';
import { FindReportQuery, InvestReportResponse } from '../dto';

@ApiTags('invest-reports')
@Controller('invest-reports')
export class InvestReportController {
  constructor(private readonly service: InvestReportService) {}

  @ApiOkResponse({ type: InvestReportResponse, isArray: true })
  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @ApiOkResponse({ type: InvestReportResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
