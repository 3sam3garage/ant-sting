import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationBatchModule } from './economic-information';
import { PocBatchModule } from './poc';

@Module({
  imports: [CoreModule, EconomicInformationBatchModule, PocBatchModule],
})
export class BatchModule {}
