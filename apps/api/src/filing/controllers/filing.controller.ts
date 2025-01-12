import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilingService } from '../services';
import { FindFilingsQuery } from '../dto';

@ApiTags('filings')
@Controller('filings')
export class FilingController {
  constructor(private readonly service: FilingService) {}

  @Get()
  async findByTickers(@Query() query: FindFilingsQuery) {
    return this.service.findByTickers(query);
  }

  // @ApiOkResponse({ type: ExchangeRateResponse, isArray: true })
  @Get('/ticker-list')
  async findTickerList(): Promise<string[]> {
    return this.service.findTickerList();
  }
}
