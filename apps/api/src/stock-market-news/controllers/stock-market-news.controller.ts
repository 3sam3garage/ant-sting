import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockMarketNewsService } from '../services';
import { FindStockMarketNewsQuery } from '../dto';

@ApiTags('stock-market-news')
@Controller('stock-market-news')
export class StockMarketNewsController {
  constructor(private readonly service: StockMarketNewsService) {}

  @Get()
  async findByTicker(@Query() query: FindStockMarketNewsQuery) {
    return this.service.findByTicker(query);
  }
}
