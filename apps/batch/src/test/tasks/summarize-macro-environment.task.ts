import { Injectable, Logger } from '@nestjs/common';
import { MacroEnvironmentRepository } from '@libs/domain';
import { format } from 'date-fns';
import { ClaudeService } from '@libs/ai';
import { COMBINE_AND_EXTRACT_KEYWORDS_PROMPT } from '@libs/ai';

/**
 * @poc
 */
@Injectable()
export class SummarizeMacroEnvironmentTask {
  constructor(
    private readonly repo: MacroEnvironmentRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  async exec() {
    const date = format(new Date(), 'yyyy-MM-dd');
    const macroEntity = await this.repo.findOneByDate(date);
    if (!macroEntity) {
      Logger.error('macro-environment Entity 가 존재하지 않습니다.');
      return;
    }

    const { debenture, economy, marketInfo, invest } = macroEntity;

    const prompt = COMBINE_AND_EXTRACT_KEYWORDS_PROMPT.replace(
      '{{DEBENTURE}}',
      debenture.summaries.join('\n'),
    )
      .replace('{{ECONOMY}}', economy.summaries.join('\n'))
      .replace('{{INVEST}}', invest.summaries.join('\n'))
      .replace('{{MARKET_INFO}}', marketInfo.summaries.join('\n'));

    const response = await this.claudeService.invoke(prompt);

    console.log(response);
  }
}
