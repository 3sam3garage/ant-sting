import { Injectable } from '@nestjs/common';
import { EconomicInformationRepository } from '@libs/domain';
import { GeminiService } from '@libs/ai';
import { SlackApi } from '@libs/external-api';
import { format } from 'date-fns';

/**
 * @poc
 */
@Injectable()
export class GraphEconomicInformationTask {
  constructor(
    private readonly infoRepo: EconomicInformationRepository,
    private readonly geminiService: GeminiService,
    private readonly slackService: SlackApi,
  ) {}

  async exec() {
    const date = format(new Date('2025-07-04'), 'yyyy-MM-dd');
    const infoEntity = await this.infoRepo.findOneByDate(date);

    // const prompt = ANALYZE_GEMMA_ECONOMIC_INFORMATION_PROMPT.replace(
    //   '{{ECONOMIC_INFORMATION}}',
    //   JSON.stringify(infoEntity?.items || []),
    // );

    // const response = await this.geminiService.invoke({ contents: prompt });
    // console.log(response);
  }
}
