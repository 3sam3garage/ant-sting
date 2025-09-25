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
    { provide: EXTERNAL_API_TOKEN.SLACK_API, useClass: SlackApi },
    { provide: EXTERNAL_API_TOKEN.KCIF_API, useClass: KcifApi },
    { provide: EXTERNAL_API_TOKEN.NAVER_PAY_API, useClass: NaverPayApi },
    { provide: EXTERNAL_API_TOKEN.POLY_MARKET_API, useClass: PolyMarketApi },
    { provide: EXTERNAL_API_TOKEN.SEC_API_SERVICE, useClass: SecApiService },
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
