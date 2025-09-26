import { BaseDomainEntity } from '../base.domain.entity';
import { keyBy } from 'lodash';

export class PortfolioItem {
  name: string;
  cusip: string;
  date: string;
  shareAmount: number;
  value: number;
  portion: number;
}

export class Portfolio extends BaseDomainEntity {
  issuer: string;
  url: string;
  date: string;
  totalValue: number;
  items: PortfolioItem[];

  static figureAddedAndRemoved(
    latest: Portfolio,
    old: Portfolio,
  ): { added: PortfolioItem[]; removed: PortfolioItem[] } {
    const newSet = new Set(latest.items.map((item) => item.cusip));
    const removedSet = new Set(old.items.map((item) => item.cusip));
    for (const cusip of [...newSet]) {
      const currentIncludes = newSet.has(cusip);
      const prevIncludes = removedSet.has(cusip);
      if (currentIncludes && prevIncludes) {
        newSet.delete(cusip);
        removedSet.delete(cusip);
      }
    }

    const cusipMap = keyBy([...latest.items, ...old.items], 'cusip');

    return {
      added: [...newSet].map((cusip) => cusipMap[cusip]),
      removed: [...removedSet].map((cusip) => cusipMap[cusip]),
    };
  }
}
