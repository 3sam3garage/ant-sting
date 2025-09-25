import { Inject, Injectable } from '@nestjs/common';
import { ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT } from '@libs/infrastructure/ai';
import { today } from '@libs/shared/common';
import {
  EconomicInformationAnalysis,
  EconomicInformationAnalysisRepositoryImpl,
  EconomicInformationRepositoryImpl,
} from '@libs/domain';
import {
  AI_TOKEN,
  AIServiceImpl,
  EXTERNAL_API_TOKEN,
  MONGO_REPOSITORY_TOKEN,
  SlackApiImpl,
} from '@libs/application';

@Injectable()
export class AnalyzeEconomicInformationTask {
  constructor(
    @Inject(MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION)
    private readonly infoRepo: EconomicInformationRepositoryImpl,
    @Inject(MONGO_REPOSITORY_TOKEN.ECONOMIC_INFORMATION_ANALYSIS)
    private readonly analysisRepo: EconomicInformationAnalysisRepositoryImpl,
    @Inject(AI_TOKEN.GEMINI)
    private readonly geminiService: AIServiceImpl,
    @Inject(EXTERNAL_API_TOKEN.SLACK_API)
    private readonly slackService: SlackApiImpl,
  ) {}

  async exec() {
    const date = today();
    // const date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const [infoEntity, analysisEntity] = await Promise.all([
      this.infoRepo.findOneByDate(date),
      this.analysisRepo.findOneByDate(date),
    ]);

    switch (true) {
      case !infoEntity:
        throw new Error(`economic-information Entity date ${date} not found.`);
      case !!analysisEntity:
        throw new Error('economic-information-analysis Entity already exists.');
    }

    const prompt = ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{ECONOMIC_INFORMATION}}',
      JSON.stringify(infoEntity?.items || []),
    );

    const response = await this.geminiService.invoke({ contents: prompt });

    const analysis = EconomicInformationAnalysis.create({ ...response, date });
    await this.analysisRepo.save(analysis);

    // slack 발송
    // const economicInformationMessage = fromEconomicInfoToSlackMessage(analysis);
    // await this.slackService.sendMessage(economicInformationMessage);
  }
}
