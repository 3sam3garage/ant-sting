import { BaseReport } from '.';

export interface StockReport extends BaseReport {
  stockName: string;
  code: string;
}
