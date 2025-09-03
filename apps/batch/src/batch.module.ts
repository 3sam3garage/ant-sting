import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/shared/core';
import { EconomicInformationBatchModule } from './economic-information';
import { PocBatchModule } from './poc';
import { PolyMarketBatchModule } from './poly-market';

@Module({
  imports: [
    CoreModule,
    EconomicInformationBatchModule,
    PolyMarketBatchModule,

    // poc
    PocBatchModule,
  ],
})
export class BatchModule {}
