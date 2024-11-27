import { Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysisRepository,
  StockAnalysisRepository,
} from '@libs/domain';
import {
  fromEconomicInfoToSlackMessage,
  fromForeignStockAnalysisToSlackMessage,
  fromStockAnalysisToSlackMessage,
  SlackService,
} from '@libs/external-api';
import { today } from '@libs/common';

@Injectable()
export class SendSlackNotificationTask {
  constructor(
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly economicInfoAnalysisRepo: EconomicInformationAnalysisRepository,
    private readonly slackService: SlackService,
  ) {}

  async exec(): Promise<void> {
    const date = today();
    const [korStockAnalysis, foreignStockAnalysis, economicInfoAnalysis] =
      await Promise.all([
        this.stockAnalysisRepo.findRecommendAnalysisByDate(date),
        this.stockAnalysisRepo.findForeignRecommendAnalysisByDate(date),
        this.economicInfoAnalysisRepo.findOneByDate(date),
      ]);

    const economicInformationMessage =
      fromEconomicInfoToSlackMessage(economicInfoAnalysis);
    const stockAnalysisMessage =
      fromStockAnalysisToSlackMessage(korStockAnalysis);
    const foreignStockAnalysisMessage =
      fromForeignStockAnalysisToSlackMessage(foreignStockAnalysis);

    await this.slackService.sendMessage(economicInformationMessage);
    await this.slackService.sendMessage(stockAnalysisMessage);
    await this.slackService.sendMessage(foreignStockAnalysisMessage);
  }
}
