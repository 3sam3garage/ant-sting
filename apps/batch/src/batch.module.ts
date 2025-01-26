import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { StockReportBatchModule } from './stock-report';
import { EconomicInformationBatchModule } from './economic-information';
import { StockBatchModule } from './stock';

import { CorporationBatchModule } from './x-production/corporation';
import { TestBatchModule } from './x-production/test';
import { NotificationBatchModule } from './x-production/notification';
import { PocBatchModule } from './x-production/poc';

@Module({
  imports: [
    CoreModule,

    // test
    TestBatchModule,
    PocBatchModule,

    // actual running batches
    CorporationBatchModule,
    StockReportBatchModule,
    StockBatchModule,
    EconomicInformationBatchModule,
    NotificationBatchModule,
  ],
})
export class BatchModule {}
