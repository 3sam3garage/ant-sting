import { Module } from '@nestjs/common';
import {
  DataGovApiService,
  KoreaBankApiService,
  SlackService,
} from './services';

@Module({
  providers: [DataGovApiService, SlackService, KoreaBankApiService],
  exports: [DataGovApiService, SlackService, KoreaBankApiService],
})
export class ExternalApiModule {}
