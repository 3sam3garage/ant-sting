import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterestRateService } from '../services';
import { FindInterestRatesQuery } from '../dto';

@ApiTags('interest-rates')
@Controller('interest-rates')
export class InterestRateController {
  constructor(private readonly service: InterestRateService) {}

  @Get('graph')
  async retrieveGraph(@Query() query: FindInterestRatesQuery) {
    return this.service.retrieveGraph(query);
  }
}
