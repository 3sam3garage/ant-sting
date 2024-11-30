import { MARKET_POSITION, MARKET_TYPE } from '@libs/domain';

export interface FindAnalysisByDate {
  market?: MARKET_TYPE;
  aiSuggestion?: MARKET_POSITION;
  reportSuggestion?: MARKET_POSITION;

  from: Date;
  to: Date;
}
