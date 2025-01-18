import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExchangeRateService } from '../services';
import { ExchangeRateResponse, FindExchangeRatesQuery } from '../dto';

@ApiTags('exchange-rates')
@Controller('exchange-rates')
export class ExchangeRateController {
  constructor(private readonly service: ExchangeRateService) {}

  @ApiOkResponse({ type: ExchangeRateResponse, isArray: true })
  @Get()
  async findByDate(@Query() query: FindExchangeRatesQuery) {
    return this.service.findByDate(query);
  }

  @Get('graph')
  async graph(@Query() query: FindExchangeRatesQuery) {
    return this.service.processGraph(query);
  }
}
