import { ObjectId } from 'mongodb';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockAnalysisService } from '../services';
import {
  CountAnalysisResponse,
  FindAnalysisQuery,
  StockAnalysisResponse,
} from '../dto';
import { FigureShareResponse } from '../../common';

@ApiTags('stock-analysis')
@Controller('stock-analysis')
export class StockAnalysisController {
  constructor(private readonly service: StockAnalysisService) {}

  @ApiOkResponse({ type: StockAnalysisResponse, isArray: true })
  @Get()
  async findByDate(@Query() query: FindAnalysisQuery) {
    return this.service.findByDate(query);
  }

  @ApiOkResponse({ type: CountAnalysisResponse })
  @Get('count')
  async count(@Query() query: FindAnalysisQuery) {
    return this.service.countByDate(query);
  }

  @ApiOkResponse({ type: FigureShareResponse })
  @Get('share')
  async share(@Query() query: FindAnalysisQuery) {
    return this.service.figureShare(query);
  }

  @ApiOkResponse({ type: StockAnalysisResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
