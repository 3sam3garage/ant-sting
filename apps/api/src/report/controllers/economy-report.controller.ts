import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindReportQuery } from '../dto';
import { ObjectId } from 'mongodb';
import { EconomyReportService } from '../services';

@Controller('economy-reports')
export class EconomyReportController {
  constructor(private readonly service: EconomyReportService) {}

  @Get()
  async findMany(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
