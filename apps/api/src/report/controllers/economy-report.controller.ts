import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { FindReportQuery } from '../dto';
import { EconomyReportService } from '../services';

@ApiTags('economy-reports')
@Controller('economy-reports')
export class EconomyReportController {
  constructor(private readonly service: EconomyReportService) {}

  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
