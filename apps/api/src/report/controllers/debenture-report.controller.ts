import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DebentureReportService } from '../services';
import { FindReportQuery } from '../dto';

@Controller('debenture-reports')
export class DebentureReportController {
  constructor(private readonly service: DebentureReportService) {}

  @Get()
  async findMany(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
