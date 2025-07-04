import { Module } from '@nestjs/common';
import { SlackApi, KcifApi, NaverPayApi } from './services';

@Module({
  providers: [SlackApi, KcifApi, NaverPayApi],
  exports: [SlackApi, KcifApi, NaverPayApi],
})
export class ExternalApiModule {}
