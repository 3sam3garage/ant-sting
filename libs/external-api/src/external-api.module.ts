import { Module } from '@nestjs/common';
import { DataGovApiService } from './services';

@Module({
  providers: [DataGovApiService],
  exports: [DataGovApiService],
})
export class ExternalApiModule {}
