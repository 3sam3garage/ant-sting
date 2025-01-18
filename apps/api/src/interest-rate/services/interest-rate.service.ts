import { Injectable } from '@nestjs/common';
import { InterestRateRepository } from '@libs/domain';
import { FindInterestRatesQuery } from '../dto';
import { groupBy } from 'lodash';

@Injectable()
export class InterestRateService {
  constructor(private readonly repo: InterestRateRepository) {}

  async retrieveGraph(query: FindInterestRatesQuery) {
    const indexes = await this.repo.findByCountries(query);
    const groups = groupBy(indexes, 'date');

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
