import { Module } from '@nestjs/common';
import { SlackApi, KcifApi, NaverPayApi, PolyMarketApi } from './services';

@Module({
  providers: [SlackApi, KcifApi, NaverPayApi, PolyMarketApi],
  exports: [SlackApi, KcifApi, NaverPayApi, PolyMarketApi],
})
export class ExternalApiModule {}
