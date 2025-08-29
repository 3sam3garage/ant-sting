import { Injectable } from '@nestjs/common';
import { EconomicInformationRepository } from '@libs/mongo';
import { GeminiService, GRAPH_ECONOMIC_INFORMATION_PROMPT } from '@libs/ai';
import { SlackApi } from '@libs/external-api';
import { flatten } from 'lodash';

@Injectable()
export class GraphEconomicInformationTask {
  constructor(
    private readonly infoRepo: EconomicInformationRepository,
    private readonly geminiService: GeminiService,
    private readonly slackService: SlackApi,
  ) {}

  private async figureInfos() {
    // const date = format(new Date('2025-07-04'), 'yyyy-MM-dd');
    // const infoEntity = await this.infoRepo.findOneByDate(date);
    // return infoEntity.items || [];

    const infoEntities = await this.infoRepo.find({ skip: 0, take: 1 });
    const infosByEntities = infoEntities.map((item) => item.items || []);
    return flatten(infosByEntities);
  }

  async exec() {
    const items = await this.figureInfos();

    const prompt = GRAPH_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{ECONOMIC_INFORMATION}}',
      JSON.stringify(items || []),
    );

    const response = await this.geminiService.invoke({ contents: prompt });
    const { connections } = response;

    let graph = 'graph TD\n';
    for (const connection of connections) {
      let { from, to } = connection;
      from = from.replaceAll(' ', '_');
      to = to.replaceAll(' ', '_');

      graph += `${from} --> ${to}\n`;
    }

    console.log(graph);
  }
}
