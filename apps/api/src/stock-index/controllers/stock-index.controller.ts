import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockIndexService } from '../services';
import { FindStockIndexesQuery } from '../dto';

@ApiTags('stock-indexes')
@Controller('stock-indexes')
export class StockIndexController {
  constructor(private readonly service: StockIndexService) {}

  @Get()
  async find(@Query() query: FindStockIndexesQuery) {
    return this.service.findByCountries(query);
  }

  @Get('graph')
  async retrieveGraph(@Query() query: FindStockIndexesQuery) {
    return this.service.retrieveGraph(query);
  }
}
