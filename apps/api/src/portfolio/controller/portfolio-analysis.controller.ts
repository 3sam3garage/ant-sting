import { Controller, Get, Query } from '@nestjs/common';
import {
  FigureAcquiredService,
  FigureAnalysisInPeriodService,
} from '../service';

@Controller('portfolio-analysis')
export class PortfolioAnalysisController {
  constructor(
    private readonly figureMostRetainService: FigureAnalysisInPeriodService,
    private readonly figureAcquiredService: FigureAcquiredService,
  ) {}

  @Get('summary')
  async summary(@Query('period') period: number) {
    return await this.figureMostRetainService.exec(period);
  }

  @Get('acquired')
  async acquired(@Query('period') period: number) {
    return await this.figureAcquiredService.exec(period);
  }
}
