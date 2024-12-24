import { Injectable } from '@nestjs/common';
import { KoreaBankApiService } from '@libs/external-api';
import { format, parse, subMonths } from 'date-fns';
import {
  BOND_COUNTRIES,
  BOND_TYPE,
  BondYield,
  BondYieldRepository,
} from '@libs/domain';

@Injectable()
export class BondYieldFetcher {
  constructor(
    private readonly koreaBankApi: KoreaBankApiService,
    private readonly repo: BondYieldRepository,
  ) {}

  async exec() {
    const now = new Date();
    const endDate = format(now, 'yyyyMM');
    const startDate = format(subMonths(now, 12), 'yyyyMM');

    const res = await this.koreaBankApi.fetchBondYieldInTerms({
      startDate,
      endDate,
      limit: 1000,
    });

    for (const item of res?.StatisticSearch?.row || []) {
      const { TIME, ITEM_CODE1, ITEM_CODE2, DATA_VALUE } = item;
      const date = format(parse(TIME, 'yyyyMM', new Date()), 'yyyy-MM');
      const country = ITEM_CODE2 as BOND_COUNTRIES;
      const type = ITEM_CODE1 as BOND_TYPE;

      const foundEntity = await this.repo.findOne({
        where: { date, country, type },
      });

      if (!foundEntity) {
        const entity = BondYield.create({
          country,
          type,
          date,
          interestRate: +DATA_VALUE,
        });
        await this.repo.save(entity);
      }
    }
  }
}
