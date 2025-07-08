import { Module } from '@nestjs/common';
import {
  SlackApi,
  KcifApi,
  NaverPayApi,
  PolyMarketApi,
  SecApiService,
} from './services';

@Module({
  providers: [SlackApi, KcifApi, NaverPayApi, PolyMarketApi, SecApiService],
  exports: [SlackApi, KcifApi, NaverPayApi, PolyMarketApi, SecApiService],
})
export class ExternalApiModule {}
