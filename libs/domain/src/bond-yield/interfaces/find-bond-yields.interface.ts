import { BOND_COUNTRIES } from '../constants';

export interface FindBondYields {
  from: Date;
  to: Date;
  countries: BOND_COUNTRIES[];
}
