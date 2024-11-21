import { Injectable } from '@nestjs/common';
import {
  EconomicInformationAnalysis,
  EconomicInformationAnalysisRepository,
  EconomicInformationRepository,
} from '@libs/domain';
import { ClaudeService } from '@libs/ai';
import { ANALYZE_ECONOMIC_INFORMATION_PROMPT } from '@libs/ai';
import { today } from '@libs/common';

/**
 * @poc
 */
@Injectable()
export class AnalyzeEconomicInformationTask {
  constructor(
    private readonly infoRepo: EconomicInformationRepository,
    private readonly analysisRepo: EconomicInformationAnalysisRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  async exec() {
    const date = today();
    const [infoEntity, analysisEntity] = await Promise.all([
      this.infoRepo.findOneByDate(date),
      this.analysisRepo.findOneByDate(date),
    ]);

    switch (true) {
      case !infoEntity:
        throw new Error('economic-information Entity not found.');
      case !!analysisEntity:
        throw new Error('economic-information-analysis Entity already exists.');
    }

    const prompt = ANALYZE_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{INFORMATION}}',
      infoEntity.items.join('\n'),
    );
    const response = await this.claudeService.invoke(prompt);

    const analysis = EconomicInformationAnalysis.create({ ...response, date });
    await this.analysisRepo.save(analysis);
  }
}
