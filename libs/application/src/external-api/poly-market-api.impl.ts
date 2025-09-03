import { TrendingPoll } from '@libs/domain';

export interface PolyMarketApiImpl {
  trendingPolls(): Promise<TrendingPoll>;
}
