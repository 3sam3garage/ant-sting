export interface SecTickerResponse {
  [key: string]: {
    cik_str: number;
    ticker: string;
    title: string;
  };
}
