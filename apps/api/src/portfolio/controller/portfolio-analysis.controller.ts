import { Controller, Get, Query } from '@nestjs/common';
import { FigureAnalysisInPeriodService } from '../service';

@Controller('portfolio-analysis')
export class PortfolioAnalysisController {
  constructor(
    private readonly figureMostRetainService: FigureAnalysisInPeriodService,
  ) {}

  @Get('in-period')
  async portfolioAnalysis(@Query('period') period: number) {
    return await this.figureMostRetainService.exec(period);
  }
}
