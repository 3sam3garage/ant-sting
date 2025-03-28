import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockReportService } from '../services';
import { FindStockQuery, StockReportResponse } from '../dto';

@ApiTags('stock-reports')
@Controller('stock-reports')
export class StockReportController {
  constructor(private readonly service: StockReportService) {}

  @ApiOkResponse({ type: StockReportResponse, isArray: true })
  @Get()
  async findByDate(
    @Query() query: FindStockQuery,
  ): Promise<StockReportResponse[]> {
    return this.service.findByDate(query);
  }

  @ApiOkResponse({ type: Number })
  @Get('count')
  async count(@Query() query: FindStockQuery) {
    return this.service.countByDate(query);
  }

  @ApiOkResponse({ type: StockReportResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string): Promise<StockReportResponse> {
    return this.service.findOneById(new ObjectId(_id));
  }
}
