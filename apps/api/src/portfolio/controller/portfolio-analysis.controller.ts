import { Controller, Get, Query } from '@nestjs/common';
import {
  FigureAcquiredService,
  FigureAnalysisInPeriodService,
  FigureValueService,
} from '../service';

@Controller('portfolio-analysis')
export class PortfolioAnalysisController {
  constructor(
    private readonly figureMostRetainService: FigureAnalysisInPeriodService,
    private readonly figureAcquiredService: FigureAcquiredService,
    private readonly figureValueService: FigureValueService,
  ) {}

  @Get('summary')
  async summary(@Query('period') period: number) {
    return await this.figureMostRetainService.exec(period);
  }

  @Get('acquired')
  async acquired(@Query('period') period: number) {
    return await this.figureAcquiredService.exec(period);
  }

  @Get('value')
  async byValue(@Query('period') period: number) {
    return await this.figureValueService.exec(period);
  }
}
