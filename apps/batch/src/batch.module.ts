import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { CorporationBatchModule } from './corporation';
import { StockBatchModule } from './stock';
import { TestBatchModule } from './test';
import { EconomicInformationBatchModule } from './economic-information';

@Module({
  imports: [
    CoreModule,

    // test
    TestBatchModule,

    // actual running batches
    CorporationBatchModule,
    StockBatchModule,
    EconomicInformationBatchModule,
  ],
})
export class BatchModule {}
