import { Inject, Injectable } from '@nestjs/common';
import {
  EXTERNAL_API_TOKEN,
  fromPolyMarketToSlackMessage,
  PolyMarketApiImpl,
  SlackApiImpl,
} from '@libs/application';

@Injectable()
export class ScrapePollTask {
  constructor(
    @Inject(EXTERNAL_API_TOKEN.SLACK_API)
    private readonly slackApi: SlackApiImpl,
    @Inject(EXTERNAL_API_TOKEN.POLY_MARKET_API)
    private readonly polyMarketApi: PolyMarketApiImpl,
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
