import { CURRENCY_TYPE } from '../../constants';

export interface FindExchangeRates {
  from: Date;
  to: Date;
  currency: CURRENCY_TYPE[];
}
