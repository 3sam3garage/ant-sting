import { Type } from 'class-transformer';

export class MarketItem {
  question: string;
  outcomes: string;
  outcomePrices: string;
  active: boolean;
  closed: boolean;
}

export class PollItem {
  @Type(() => MarketItem)
  markets: MarketItem[];

  filterButActiveOutcomes() {
    const polls: Array<{ question: string; Yes: number; No: number }> = [];

    for (const marketItem of this.markets) {
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

      polls.push(poll as never);
    }

    return polls;
  }
}

export class TrendingPoll {
  @Type(() => PollItem)
  data: PollItem[];
}
