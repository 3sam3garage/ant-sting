import { INTEREST_COUNTRIES } from '@libs/domain';

export interface FindInterestRates {
  from: Date;
  to: Date;
  countries: INTEREST_COUNTRIES[];
}
