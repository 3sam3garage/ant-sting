import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiTags } from '@nestjs/swagger';
import { StockReportService } from '../services';
import { FindReportQuery } from '../dto';

@ApiTags('stock-reports')
@Controller('stock-reports')
export class StockReportController {
  constructor(private readonly service: StockReportService) {}

  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @Get('highest-gap')
  async findReportWithHighestGap() {
    return this.service.findReportWithHighestGap();
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
