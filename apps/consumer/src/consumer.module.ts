import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationModule } from './economic-information';
import { SecFilingModule } from './sec-filing';

@Module({
  imports: [CoreModule, EconomicInformationModule, SecFilingModule],
})
export class ConsumerModule {}
