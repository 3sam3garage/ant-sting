import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { CorporationBatchModule } from './corporation';
import { StockBatchModule } from './stock';
import { TestBatchModule } from './test';
import { EconomicInformationBatchModule } from './economic-information';
import { NotificationBatchModule } from './notification';

@Module({
  imports: [
    CoreModule,

    // test
    TestBatchModule,

    // actual running batches
    CorporationBatchModule,
    StockBatchModule,
    EconomicInformationBatchModule,
    NotificationBatchModule,
  ],
})
export class BatchModule {}
