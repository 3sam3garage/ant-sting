import { groupBy, maxBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ExchangeRateRepository } from '@libs/domain';
import { FindExchangeRatesQuery } from '../dto';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly repo: ExchangeRateRepository) {}

  async findByDate(query: FindExchangeRatesQuery) {
    return await this.repo.findByDate(query);
  }

  async processGraph(query: FindExchangeRatesQuery) {
    const exchangeRates = await this.repo.findByDate(query);

    const groups = groupBy(exchangeRates, 'targetCurrency');
    const map = new Map<string, any>();
    for (const [key, group] of Object.entries(groups)) {
      const maxValue =
        maxBy(group, (item) => item.exchangeRate)?.exchangeRate || 0;

      for (const item of group) {
        const exchangeRateInfo = map.get(item.date) || {};

        map.set(item.date, {
          ...exchangeRateInfo,
          date: item.date,
          [key]: item.exchangeRate / maxValue,
        });
      }
    }

    const items = [];
    for (const [, value] of map) {
      items.push(value);
    }

    return items;
  }
}
