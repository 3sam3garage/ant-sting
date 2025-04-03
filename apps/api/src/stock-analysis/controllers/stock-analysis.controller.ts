import { ObjectId } from 'mongodb';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockAnalysisService } from '../services';
import { FindAnalysisQuery, StockAnalysisResponse } from '../dto';

@ApiTags('stock-analysis')
@Controller('/v1/stock-analysis')
export class StockAnalysisController {
  constructor(private readonly service: StockAnalysisService) {}

  @ApiOkResponse({ type: StockAnalysisResponse, isArray: true })
  @Get()
  async findByDate(@Query() query: FindAnalysisQuery) {
    return this.service.findByDate(query);
  }

  @ApiOkResponse({ type: StockAnalysisResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
