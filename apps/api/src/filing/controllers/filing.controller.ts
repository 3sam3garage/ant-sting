import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilingService } from '../services';
import { FilingResponse, FindFilingsQuery } from '../dto';
import { ObjectId } from 'mongodb';

@ApiTags('filings')
@Controller('filings')
export class FilingController {
  constructor(private readonly service: FilingService) {}

  @Get()
  async findByTickers(
    @Query() query: FindFilingsQuery,
  ): Promise<FilingResponse[]> {
    return this.service.findByTickers(query);
  }

  @Get(':_id')
  async findOneById(@Param('_id') _id: string): Promise<FilingResponse> {
    return this.service.findOneById(new ObjectId(_id));
  }
}
