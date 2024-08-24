import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiTags } from '@nestjs/swagger';
import { IndustryReportService } from '../services';
import { FindReportQuery } from '../dto';

@ApiTags('industry-reports')
@Controller('industry-reports')
export class IndustryReportController {
  constructor(private readonly service: IndustryReportService) {}

  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
