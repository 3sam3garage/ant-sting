import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilingService } from '../services';
import {
  FigureFilingShareQuery,
  FilingResponse,
  FindFilingsQuery,
} from '../dto';
import { ObjectId } from 'mongodb';

@ApiTags('filings')
@Controller('filings')
export class FilingController {
  constructor(private readonly service: FilingService) {}

  @Get()
  async find(@Query() query: FindFilingsQuery): Promise<FilingResponse[]> {
    return this.service.find(query);
  }

  @Get('share')
  async figureShare(@Query() query: FigureFilingShareQuery) {
    return this.service.figureShare(query);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string): Promise<FilingResponse> {
    return this.service.findOneById(new ObjectId(_id));
  }
}
