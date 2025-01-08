import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BondYieldService } from '../services';
import { BondYieldChartResponse, FindBondYieldsQuery } from '../dto';

@ApiTags('bond-yields')
@Controller('bond-yields')
export class BondYieldController {
  constructor(private readonly service: BondYieldService) {}

  @ApiOkResponse({ type: BondYieldChartResponse, isArray: true })
  @Get('chart')
  async retrieveChart(@Query() query: FindBondYieldsQuery) {
    return this.service.findByDate(query);
  }
}
