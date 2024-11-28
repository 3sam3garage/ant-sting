import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StockAnalysisService } from '../services';
import { FindByDateQuery, StockAnalysisResponse } from '../dto';

@ApiTags('stock-analysis')
@Controller('stock-analysis')
export class StockAnalysisController {
  constructor(private readonly service: StockAnalysisService) {}

  @ApiOkResponse({ type: StockAnalysisResponse, isArray: true })
  @Get()
  async findByDate(@Query() { date }: FindByDateQuery) {
    return this.service.findByDate(date);
  }
}
