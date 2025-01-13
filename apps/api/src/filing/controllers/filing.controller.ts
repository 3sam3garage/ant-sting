import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilingService } from '../services';
import { FilingResponse, FindFilingsQuery } from '../dto';

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
}
