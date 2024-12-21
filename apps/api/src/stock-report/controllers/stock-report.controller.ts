import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockReportService } from '../services';
import { StockReportResponse } from '../dto';
import {
  CountByItemResponse,
  FigureShareResponse,
  FindByDateQuery,
} from '../../components';

@ApiTags('stock-reports')
@Controller('stock-reports')
export class StockReportController {
  constructor(private readonly service: StockReportService) {}

  @ApiOkResponse({ type: StockReportResponse, isArray: true })
  @Get()
  async findByDate(@Query() query: FindByDateQuery) {
    return this.service.findByDate(query);
  }

  @ApiOkResponse({ type: Number })
  @Get('count')
  async count(@Query() query: FindByDateQuery) {
    return this.service.countByDate(query);
  }

  @ApiOkResponse({ type: FigureShareResponse })
  @Get('share')
  async share(@Query() query: FindByDateQuery) {
    return this.service.figureShare(query);
  }

  @ApiOkResponse({ type: CountByItemResponse })
  @Get('count-by-item')
  async countByReports(@Query() query: FindByDateQuery) {
    return this.service.countByReport(query);
  }

  @ApiOkResponse({ type: StockReportResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
