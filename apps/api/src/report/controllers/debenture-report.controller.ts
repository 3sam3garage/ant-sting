import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DebentureReportService } from '../services';
import { DebentureReportResponse, FindReportQuery } from '../dto';

@ApiTags('debenture-reports')
@Controller('debenture-reports')
export class DebentureReportController {
  constructor(private readonly service: DebentureReportService) {}

  @ApiOkResponse({ type: DebentureReportResponse, isArray: true })
  @Get()
  async findByDate(@Query() { date }: FindReportQuery) {
    return this.service.findByDate(date);
  }

  @ApiOkResponse({ type: DebentureReportResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string) {
    return this.service.findOneById(new ObjectId(_id));
  }
}
