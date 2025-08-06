import { Injectable } from '@nestjs/common';
import {
  fromPolyMarketToSlackMessage,
  MarketItem,
  Outcome,
  PolyMarketApi,
  SlackApi,
} from '@libs/external-api';

@Injectable()
export class ScrapePollTask {
  constructor(
    private readonly slackApi: SlackApi,
    private readonly polyMarketApi: PolyMarketApi,
  ) {}

  private figureOutcomes(marketItems: MarketItem[]): Outcome[] {
    const polls = [];
    for (const marketItem of marketItems) {
      const { active, closed } = marketItem;
      if (!active || closed) {
        continue;
      }

      // eslint-disable-next-line prefer-const
      let { question, outcomes, outcomePrices } = marketItem;
      outcomes = JSON.parse(outcomes);
      outcomePrices = JSON.parse(outcomePrices);
      const outcomeLengths = outcomes.length || 0;

      const poll = { question };
      for (let i = 0; i < +outcomeLengths; i++) {
        const percentage = +outcomePrices[i] * 100;
        poll[outcomes[i]] = parseFloat(percentage.toFixed(2));
      }

      polls.push(poll);
    }

    return polls;
  }

  async exec() {
    const { data: items } = await this.polyMarketApi.trendingPolls();

    const outComes: Outcome[] = [];
    for (const item of items) {
      const marketItems = this.figureOutcomes(item.markets).filter(
        (item) => item.Yes > 50,
      );

      if (marketItems.length > 0) {
        outComes.push(...marketItems);
      }
    }


    // @todo 나중에 분리 발송 필요. 일단 16건만 처리되도록 함.
    const message = fromPolyMarketToSlackMessage(outComes.slice(0, 16));
    await this.slackApi.sendMessage(message);
  }
}
