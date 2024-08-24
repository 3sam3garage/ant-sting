import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MarketInfoReportService } from '../services';
import { FindReportQuery, MarketInfoReportResponse } from '../dto';

@ApiTags('market-info-reports')
@Controller('market-info-reports')
export class MarketInfoReportController {
  constructor(private readonly service: MarketInfoReportService) {}

  @ApiOkResponse({ type: MarketInfoReportResponse, isArray: true })
  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @ApiOkResponse({ type: MarketInfoReportResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
