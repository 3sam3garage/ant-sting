import { Injectable, Logger } from '@nestjs/common';
import { KoreaBankApiService } from '@libs/external-api';
import { addMonths, format, parse, subMonths } from 'date-fns';
import {
  INTEREST_COUNTRIES,
  INTEREST_TYPE,
  InterestRate,
  InterestRateRepository,
} from '@libs/domain';

@Injectable()
export class InterestRateFetcher {
  constructor(
    private readonly koreaBankApi: KoreaBankApiService,
    private readonly repo: InterestRateRepository,
  ) {}

  async exec() {
    const now = new Date();
    const query = {
      startDate: format(subMonths(now, 12), 'yyyyMM'),
      endDate: format(addMonths(now, 2), 'yyyyMM'),
    };

    // 기준금리
    const baseInterest = await this.koreaBankApi.fetchBaseInterestRate(query);
    for (const item of baseInterest?.StatisticSearch?.row || []) {
      const { TIME, DATA_VALUE } = item;
      const date = format(parse(TIME, 'yyyyMM', new Date()), 'yyyy-MM');
      const foundEntity = await this.repo.findOne({
        where: {
          date,
          type: INTEREST_TYPE.BASE,
          country: INTEREST_COUNTRIES.KR,
        },
      });

      if (!foundEntity) {
        const entity = InterestRate.create({
          country: INTEREST_COUNTRIES.KR,
          type: INTEREST_TYPE.BASE,
          date,
          interestRate: +DATA_VALUE,
        });

        await this.repo.save(entity);
      }
    }

    Logger.log('기준금리 수집 완료');

    // 정책금리
    const interests = await Promise.all([
      this.koreaBankApi.fetchPolicyBaseInterestRate({
        subCode: INTEREST_COUNTRIES.KR,
        ...query,
      }),
      this.koreaBankApi.fetchPolicyBaseInterestRate({
        subCode: INTEREST_COUNTRIES.US,
        ...query,
      }),
      this.koreaBankApi.fetchPolicyBaseInterestRate({
        subCode: INTEREST_COUNTRIES.JP,
        ...query,
      }),
      this.koreaBankApi.fetchPolicyBaseInterestRate({
        subCode: INTEREST_COUNTRIES.CN,
        ...query,
      }),
    ]);

    Logger.log(`정책금리 수집 시작`);
    for (const interest of interests) {
      for (const item of interest?.StatisticSearch?.row || []) {
        const { TIME, DATA_VALUE, ITEM_CODE1 } = item;
        const date = format(parse(TIME, 'yyyyMM', new Date()), 'yyyy-MM');
        const foundEntity = await this.repo.findOne({
          where: {
            date,
            type: INTEREST_TYPE.POLICY,
            country: ITEM_CODE1,
          },
        });

        if (!foundEntity) {
          const entity = InterestRate.create({
            country: ITEM_CODE1 as INTEREST_COUNTRIES,
            type: INTEREST_TYPE.POLICY,
            date,
            interestRate: +DATA_VALUE,
          });

          await this.repo.save(entity);
        }
      }
    }
    Logger.log(`정책금리 수집 완료`);
  }
}
