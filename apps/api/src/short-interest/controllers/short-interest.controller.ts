import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ShortInterestService } from '../services';
import {
  FindShortInterestQuery,
  ShortInterestItem,
  ShortInterestResponse,
} from '../dto';

@ApiTags('short-interests')
@Controller('/v1/short-interests')
export class ShortInterestController {
  constructor(private readonly service: ShortInterestService) {}

  @ApiOkResponse({ type: ShortInterestItem, isArray: true })
  @Get()
  async findByDate(
    @Query() query: FindShortInterestQuery,
  ): Promise<ShortInterestItem[]> {
    return this.service.findByDate(query);
  }

  @ApiOkResponse({ type: ShortInterestResponse })
  @Get(':_id')
  async findOneById(@Param('_id') _id: string): Promise<ShortInterestResponse> {
    return this.service.findOneById(new ObjectId(_id));
  }
}
