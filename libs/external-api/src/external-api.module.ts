import { Module } from '@nestjs/common';
import {
  DataGovApiService,
  KoreaBankApiService,
  SecApiService,
  SlackService,
} from './services';

@Module({
  providers: [
    DataGovApiService,
    SlackService,
    KoreaBankApiService,
    SecApiService,
  ],
  exports: [
    DataGovApiService,
    SlackService,
    KoreaBankApiService,
    SecApiService,
  ],
})
export class ExternalApiModule {}
