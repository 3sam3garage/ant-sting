import { STOCK_INDEX_COUNTRIES } from '../constants';

export interface FindStockIndexes {
  from: Date;
  to: Date;
  countries: STOCK_INDEX_COUNTRIES[];
}
