import { Injectable } from '@nestjs/common';
import { BondYieldRepository } from '@libs/domain';
import { FindBondYieldsQuery } from '../dto';
import { groupBy } from 'lodash';

@Injectable()
export class BondYieldService {
  constructor(private readonly repo: BondYieldRepository) {}

  async findByDate(query: FindBondYieldsQuery) {
    const bondYields = await this.repo.findByDate(query);
    const groups = groupBy(bondYields, 'date');

    const items = [];
    for (const [date, group] of Object.entries(groups)) {
      const item = group.reduce(
        (acc, { interestRate, type }) => {
          acc[type] = interestRate;
          return acc;
        },
        { date },
      );

      items.push(item);
    }

    return items;
  }
}
