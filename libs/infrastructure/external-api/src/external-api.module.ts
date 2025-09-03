import { Module } from '@nestjs/common';
import {
  SlackApi,
  KcifApi,
  NaverPayApi,
  PolyMarketApi,
  SecApiService,
} from './services';
import { INJECTION_TOKEN } from '@libs/application';

@Module({
  providers: [
    { provide: INJECTION_TOKEN.SLACK_API, useValue: SlackApi },
    { provide: INJECTION_TOKEN.KCIF_API, useValue: KcifApi },
    { provide: INJECTION_TOKEN.NAVER_PAY_API, useValue: NaverPayApi },
    { provide: INJECTION_TOKEN.POLY_MARKET_API, useValue: PolyMarketApi },
    { provide: INJECTION_TOKEN.SEC_API_SERVICE, useValue: SecApiService },
  ],
  exports: [
    INJECTION_TOKEN.SLACK_API,
    INJECTION_TOKEN.KCIF_API,
    INJECTION_TOKEN.NAVER_PAY_API,
    INJECTION_TOKEN.POLY_MARKET_API,
    INJECTION_TOKEN.SEC_API_SERVICE,
  ],
})
export class ExternalApiModule {}
