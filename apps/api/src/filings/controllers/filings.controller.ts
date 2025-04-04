import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilingsService } from '../services';
import { FindFilingsQuery, FilingsResponse } from '../dto';

@ApiTags('filings')
@Controller('/v1/filings')
export class FilingsController {
  constructor(private readonly service: FilingsService) {}

  @ApiOkResponse({ type: FilingsResponse, isArray: true })
  @Get()
  async findByDate(
    @Query() query: FindFilingsQuery,
  ): Promise<FilingsResponse[]> {
    return this.service.findByDate(query);
  }

  @ApiOkResponse({ type: FilingsResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string): Promise<FilingsResponse> {
    return this.service.findOneById(new ObjectId(_id));
  }
}
