import { Injectable } from '@nestjs/common';
import { KoreaBankApiService } from '@libs/external-api';
import { addMonths, format, parse, subMonths } from 'date-fns';
import {
  STOCK_INDEX_COUNTRIES,
  STOCK_INDEX_TYPE,
  StockIndex,
  StockIndexRepository,
} from '@libs/domain';

@Injectable()
export class StockIndexFetcher {
  constructor(
    private readonly koreaBankApi: KoreaBankApiService,
    private readonly repo: StockIndexRepository,
  ) {}

  async exec() {
    const now = new Date();
    const query = {
      endDate: format(addMonths(now, 1), 'yyyyMM'),
      startDate: format(subMonths(now, 12), 'yyyyMM'),
    };

    const responses = await Promise.all([
      this.koreaBankApi.fetchStockIndex({ ...query, subCode: 'KOR' }),
      this.koreaBankApi.fetchStockIndex({ ...query, subCode: 'USA' }),
      this.koreaBankApi.fetchStockIndex({ ...query, subCode: 'JPN' }),
    ]);

    for (const response of responses) {
      for (const item of response?.StatisticSearch?.row || []) {
        const { DATA_VALUE, ITEM_CODE1, TIME } = item;
        const date = format(parse(TIME, 'yyyyMM', new Date()), 'yyyy-MM');

        const foundEntity = await this.repo.findOne({
          where: { date, country: ITEM_CODE1 },
        });

        if (!foundEntity) {
          const entity = StockIndex.create({
            country: ITEM_CODE1 as STOCK_INDEX_COUNTRIES,
            date,
            type: STOCK_INDEX_TYPE['2015=100'],
            indexValue: +DATA_VALUE,
          });
          await this.repo.save(entity);
        }
      }
    }
  }
}
