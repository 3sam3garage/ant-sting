import { Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysisRepository,
  StockAnalysisRepository,
} from '@libs/domain';
import {
  fromEconomicInfoToSlackMessage,
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
    const [stockAnalysis, economicInfoAnalysis] = await Promise.all([
      this.stockAnalysisRepo.findRecommendAnalysisByDate(date),
      this.economicInfoAnalysisRepo.findOneByDate(date),
    ]);

    const economicInformationMessage =
      fromEconomicInfoToSlackMessage(economicInfoAnalysis);
    const stockAnalysisMessage = fromStockAnalysisToSlackMessage(stockAnalysis);

    await this.slackService.sendMessage(economicInformationMessage);
    await this.slackService.sendMessage(stockAnalysisMessage);
  }
}
