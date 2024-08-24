import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiTags } from '@nestjs/swagger';
import { InvestReportService } from '../services';
import { FindReportQuery } from '../dto';

@ApiTags('invest-reports')
@Controller('invest-reports')
export class InvestReportController {
  constructor(private readonly service: InvestReportService) {}

  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
