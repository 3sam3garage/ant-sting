import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationBatchModule } from './economic-information';

@Module({
  imports: [CoreModule, EconomicInformationBatchModule],
})
export class BatchModule {}
