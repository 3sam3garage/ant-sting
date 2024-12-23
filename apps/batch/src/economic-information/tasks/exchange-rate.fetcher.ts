import { Injectable, Logger } from '@nestjs/common';
import {
  CURRENCY_TYPE,
  ExchangeRate,
  ExchangeRateRepository,
} from '@libs/domain';
import { EcosSearchItem, KoreaBankApiService } from '@libs/external-api';
import { format, parse, subMonths } from 'date-fns';

@Injectable()
export class ExchangeRateFetcher {
  constructor(
    private readonly repo: ExchangeRateRepository,
    private readonly koreaBankApi: KoreaBankApiService,
  ) {}

  private async saveExchangeRate(
    baseCurrency: CURRENCY_TYPE,
    targetCurrency: CURRENCY_TYPE,
    items: EcosSearchItem[],
  ) {
    for (const { TIME, DATA_VALUE } of items) {
      const date = format(parse(TIME, 'yyyyMMdd', new Date()), 'yyyy-MM-dd');

      const foundEntity = await this.repo.findOne({
        where: { date, baseCurrency, targetCurrency },
      });

      if (!foundEntity) {
        const entity = ExchangeRate.create({
          date,
          baseCurrency,
          targetCurrency,
          exchangeRate: +DATA_VALUE,
        });

        await this.repo.save(entity);
      }
    }
  }

  async exec() {
    const now = new Date();
    const endDate = format(now, 'yyyyMMdd');
    const startDate = format(subMonths(now, 1), 'yyyyMMdd');

    const fromKRWtoUSD = await this.koreaBankApi.getExchangeRate({
      code: '731Y001', // 기준 통화 - KRW
      subCode: '0000001', // USD 코드
      interval: 'D',
      startDate,
      endDate,
    });

    await this.saveExchangeRate(
      CURRENCY_TYPE.USD,
      CURRENCY_TYPE.KRW,
      fromKRWtoUSD?.StatisticSearch?.row || [],
    );
    Logger.log('KRW to USD Done');

    const fromUSDtoYen = await this.koreaBankApi.getExchangeRate({
      code: '731Y002', // 기준 통화 - USD
      subCode: '0000002', // JPY 코드
      interval: 'D',
      startDate,
      endDate,
      limit: 10000,
    });

    await this.saveExchangeRate(
      CURRENCY_TYPE.USD,
      CURRENCY_TYPE.JPY,
      fromUSDtoYen?.StatisticSearch?.row || [],
    );
    Logger.log('USD to JPY Done');

    const fromUSDtoEUR = await this.koreaBankApi.getExchangeRate({
      code: '731Y002', // 기준 통화 - USD
      subCode: '0000003', // EUR 코드
      interval: 'D',
      startDate,
      endDate,
      limit: 10000,
    });

    await this.saveExchangeRate(
      CURRENCY_TYPE.USD,
      CURRENCY_TYPE.EUR,
      fromUSDtoEUR?.StatisticSearch?.row || [],
    );
    Logger.log('USD to EUR Done');
  }
}
