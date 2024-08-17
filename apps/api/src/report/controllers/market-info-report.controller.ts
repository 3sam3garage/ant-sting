import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketInfoReportService } from '../services';
import { FindReportQuery } from '../dto';
import { ObjectId } from 'mongodb';

@Controller('market-info-reports')
export class MarketInfoReportController {
  constructor(private readonly service: MarketInfoReportService) {}

  @Get()
  async findMany(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
