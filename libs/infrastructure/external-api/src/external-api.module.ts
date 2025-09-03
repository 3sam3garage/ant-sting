import { Module } from '@nestjs/common';
import {
  SlackApi,
  KcifApi,
  NaverPayApi,
  PolyMarketApi,
  SecApiService,
} from './services';
import { EXTERNAL_API_TOKEN } from '@libs/application';

@Module({
  providers: [
    { provide: EXTERNAL_API_TOKEN.SLACK_API, useValue: SlackApi },
    { provide: EXTERNAL_API_TOKEN.KCIF_API, useValue: KcifApi },
    { provide: EXTERNAL_API_TOKEN.NAVER_PAY_API, useValue: NaverPayApi },
    { provide: EXTERNAL_API_TOKEN.POLY_MARKET_API, useValue: PolyMarketApi },
    { provide: EXTERNAL_API_TOKEN.SEC_API_SERVICE, useValue: SecApiService },
  ],
  exports: [
    EXTERNAL_API_TOKEN.SLACK_API,
    EXTERNAL_API_TOKEN.KCIF_API,
    EXTERNAL_API_TOKEN.NAVER_PAY_API,
    EXTERNAL_API_TOKEN.POLY_MARKET_API,
    EXTERNAL_API_TOKEN.SEC_API_SERVICE,
  ],
})
export class ExternalApiModule {}
