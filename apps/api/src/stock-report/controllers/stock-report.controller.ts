import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockReportService } from '../services';
import { FindByDateQuery, StockReportResponse } from '../dto';

@ApiTags('stock-reports')
@Controller('stock-reports')
export class StockReportController {
  constructor(private readonly service: StockReportService) {}

  @ApiOkResponse({ type: StockReportResponse, isArray: true })
  @Get()
  async findByDate(@Query() { date }: FindByDateQuery) {
    return this.service.findByDate(date);
  }

  @ApiOkResponse({ type: StockReportResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
