import { Module } from '@nestjs/common';
import { PortfolioMongoModule } from '@libs/infrastructure/mongo';
import { PortfolioAnalysisController, PortfolioController } from './controller';
import {
  FigureAnalysisInPeriodService,
  FigureAcquiredService,
} from './service';

@Module({
  imports: [PortfolioMongoModule],
  controllers: [PortfolioController, PortfolioAnalysisController],
  providers: [FigureAnalysisInPeriodService, FigureAcquiredService],
})
export class PortfolioModule {}
