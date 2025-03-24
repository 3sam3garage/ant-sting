import fs from 'node:fs';
import { format, startOfYear } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { ExchangeRateRepository } from '@libs/domain';
import { KoreaBankApiService } from '@libs/external-api';
import { groupBy } from 'lodash';

@Injectable()
export class AverageExchangeRateFetcher {
  constructor(
    private readonly repo: ExchangeRateRepository,
    private readonly koreaBankApi: KoreaBankApiService,
  ) {}

  private toEightDigitCode(code: string) {
    const prefixCount = 7 - `${code}`.length;
    const prefix = new Array(prefixCount).fill('0').join('');
    return `${prefix}${code}`;
  }

  /**
   * neo 미경 헬핑 유티리티
   */
  async exec() {
    const now = new Date();
    const startDate = format(startOfYear(now), 'yyyyMM');
    const endDate = format(now, 'yyyyMM');

    const exchangeRateInfos = [];
    for (let i = 1; i <= 53; i++) {
      const subCode = this.toEightDigitCode(i.toString());

      const res = await this.koreaBankApi.fetchAverageExchangeRate({
        startDate,
        endDate,
        subCode,
      });

      const rows = res?.StatisticSearch?.row || [];
      for (const row of rows) {
        exchangeRateInfos.push({
          date: row.TIME,
          name: row.ITEM_NAME1,
          value: row.DATA_VALUE,
        });
      }
    }

    // 파일로 저장
    fs.appendFileSync(
      './tmp/average-exchange-rate.csv',
      `국가,1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월\n`,
    );
    const groupedInfos = groupBy(exchangeRateInfos, 'name');
    for (const [key, items] of Object.entries(groupedInfos)) {
      const values = items?.map((item) => item.value)?.join(',');

      fs.appendFileSync(
        './tmp/average-exchange-rate.csv',
        `${key},${values}\n`,
      );
    }

    console.log(1);
  }
}
