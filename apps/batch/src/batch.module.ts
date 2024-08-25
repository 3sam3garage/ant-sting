import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { CorporationBatchModule } from './corporation';
import { ReportBatchModule } from './report';
import { TestBatchModule } from './test';

@Module({
  imports: [
    CoreModule,
    TestBatchModule,
    CorporationBatchModule,
    ReportBatchModule,
  ],
})
export class BatchModule {}
