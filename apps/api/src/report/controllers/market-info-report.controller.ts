import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiTags } from '@nestjs/swagger';
import { MarketInfoReportService } from '../services';
import { FindReportQuery } from '../dto';

@ApiTags('market-info-reports')
@Controller('market-info-reports')
export class MarketInfoReportController {
  constructor(private readonly service: MarketInfoReportService) {}

  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
