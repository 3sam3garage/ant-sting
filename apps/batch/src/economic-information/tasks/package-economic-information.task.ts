import { Injectable, Logger } from '@nestjs/common';
import { EconomicInformationRepository } from '@libs/domain';
import { format } from 'date-fns';
import { ClaudeService } from '@libs/ai';
import { PACKAGE_ECONOMIC_INFORMATION_PROMPT } from '@libs/ai';

/**
 * @poc
 */
@Injectable()
export class PackageEconomicInformationTask {
  constructor(
    private readonly repo: EconomicInformationRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  async exec() {
    const date = format(new Date(), 'yyyy-MM-dd');
    const economicInfoEntity = await this.repo.findOneByDate(date);
    if (!economicInfoEntity) {
      Logger.error('economic-information Entity 가 존재하지 않습니다.');
      return;
    }

    const prompt = PACKAGE_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{INFORMATION}}',
      economicInfoEntity.items.join('\n'),
    );

    const response = await this.claudeService.invoke(prompt);

    console.log(response);
  }
}
