import { Module } from '@nestjs/common';
import { DataGovApiService, SlackService } from './services';

@Module({
  providers: [DataGovApiService, SlackService],
  exports: [DataGovApiService, SlackService],
})
export class ExternalApiModule {}
