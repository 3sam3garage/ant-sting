import { Injectable } from '@nestjs/common';
import { StockIndexRepository } from '@libs/domain';
import { FindStockIndexesQuery } from '../dto';
import { groupBy } from 'lodash';

@Injectable()
export class StockIndexService {
  constructor(private readonly repo: StockIndexRepository) {}

  async findByCountries(query: FindStockIndexesQuery) {
    return this.repo.findByCountries(query);
  }

  async retrieveGraph(query: FindStockIndexesQuery) {
    const indexes = await this.repo.findByCountries(query);
    const groups = groupBy(indexes, 'date');

    const items = [];
    for (const [date, group] of Object.entries(groups)) {
      const item = group.reduce(
        (acc, { indexValue, country }) => {
          acc[country] = indexValue;
          return acc;
        },
        { date },
      );

      items.push(item);
    }

    return items;
  }
}
