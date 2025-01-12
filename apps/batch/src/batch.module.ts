import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { CorporationBatchModule } from './x-production/corporation';
import { StockReportBatchModule } from './stock-report';
import { TestBatchModule } from './x-production/test';
import { EconomicInformationBatchModule } from './economic-information';
import { NotificationBatchModule } from './x-production/notification';
import { StockBatchModule } from './stock';

@Module({
  imports: [
    CoreModule,

    // test
    TestBatchModule,

    // actual running batches
    CorporationBatchModule,
    StockReportBatchModule,
    StockBatchModule,
    EconomicInformationBatchModule,
    NotificationBatchModule,
  ],
})
export class BatchModule {}
