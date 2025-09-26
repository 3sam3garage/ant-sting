import { Controller, Get, Query } from '@nestjs/common';
import { FigureMostRetainService } from '../service';

@Controller('portfolio-analysis')
export class PortfolioAnalysisController {
  constructor(
    private readonly figureMostRetainService: FigureMostRetainService,
  ) {}

  @Get('in-period')
  async portfolioAnalysis(@Query('period') period: number) {
    return await this.figureMostRetainService.exec(period);
  }
}
