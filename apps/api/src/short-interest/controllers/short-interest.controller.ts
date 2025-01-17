import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShortInterestService } from '../services';
import { FindShortInterestQuery } from '../dto';

@ApiTags('short-interests')
@Controller('short-interests')
export class ShortInterestController {
  constructor(private readonly service: ShortInterestService) {}

  @Get('/ticker')
  async findOneByTicker(@Query() query: FindShortInterestQuery) {
    return this.service.findOneByTicker(query);
  }
}
