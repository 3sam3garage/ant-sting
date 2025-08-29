import { Injectable } from '@nestjs/common';
import {
  fromPolyMarketToSlackMessage,
  PolyMarketApi,
  SlackApi,
} from '@libs/external-api';

@Injectable()
export class ScrapePollTask {
  constructor(
    private readonly slackApi: SlackApi,
    private readonly polyMarketApi: PolyMarketApi,
  ) {}

  async exec() {
    const { data: items } = await this.polyMarketApi.trendingPolls();

    const outComes = [];
    for (const item of items) {
      const activeOutcomes = item
        .filterButActiveOutcomes()
        .filter((item) => item.Yes > 50);

      if (activeOutcomes.length > 0) {
        outComes.push(...activeOutcomes);
      }
    }

    // @todo 나중에 분리 발송 필요. 일단 16건만 처리되도록 함.
    const message = fromPolyMarketToSlackMessage(outComes.slice(0, 16));
    await this.slackApi.sendMessage(message);
  }
}
