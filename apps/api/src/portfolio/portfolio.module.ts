import { Module } from '@nestjs/common';
import { PortfolioMongoModule } from '@libs/infrastructure/mongo';
import { PortfolioAnalysisController, PortfolioController } from './controller';
import {
  FigureAnalysisInPeriodService,
  FigureAcquiredService,
  FigureValueService,
} from './service';

@Module({
  imports: [PortfolioMongoModule],
  controllers: [PortfolioController, PortfolioAnalysisController],
  providers: [
    FigureAnalysisInPeriodService,
    FigureAcquiredService,
    FigureValueService,
  ],
})
export class PortfolioModule {}
