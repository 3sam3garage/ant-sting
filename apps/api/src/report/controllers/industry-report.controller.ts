import { Controller, Get, Param, Query } from '@nestjs/common';
import { IndustryReportService } from '../services';
import { FindReportQuery } from '../dto';
import { ObjectId } from 'mongodb';

@Controller('industry-reports')
export class IndustryReportController {
  constructor(private readonly service: IndustryReportService) {}

  @Get()
  async findMany(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
