export interface FindFilingQuery {
  from: Date;
  to: Date;
  tickers: string[];
  formTypes: string[];
}
