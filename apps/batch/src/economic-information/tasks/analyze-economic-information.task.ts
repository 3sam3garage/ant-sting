import { Inject, Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysis,
  EconomicInformationAnalysisRepository,
  EconomicInformationRepository,
} from '@libs/mongo';
import {
  ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT,
  GeminiService,
} from '@libs/ai';
import { fromEconomicInfoToSlackMessage, SlackApi } from '@libs/external-api';
import { today } from '@libs/common';
import { EconomicInformationRepositoryImpl } from '@libs/domain';

/**
 * @poc
 */
@Injectable()
export class AnalyzeEconomicInformationTask {
  constructor(
    @Inject(EconomicInformationRepository)
    private readonly infoRepo: EconomicInformationRepositoryImpl,
    private readonly analysisRepo: EconomicInformationAnalysisRepository,
    private readonly geminiService: GeminiService,
    private readonly slackService: SlackApi,
  ) {}

  async exec() {
    const date = today();
    // const { startOfDay, endOfDay, date } = figureDateInfo();
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
    const economicInformationMessage = fromEconomicInfoToSlackMessage(analysis);
    await this.slackService.sendMessage(economicInformationMessage);
  }
}
