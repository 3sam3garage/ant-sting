import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EconomicInformationAnalysisService } from '../services';
import { EconomicInformationAnalysisResponse } from '../dto';
import { FindByDateQuery } from '../../common';

@ApiTags('economic-information-analysis')
@Controller('economic-information-analysis')
export class EconomicInformationAnalysisController {
  constructor(private readonly service: EconomicInformationAnalysisService) {}

  @ApiOkResponse({ type: EconomicInformationAnalysisResponse, isArray: true })
  @Get()
  async findByDate(@Query() query: FindByDateQuery) {
    return this.service.findByDate(query);
  }
}
