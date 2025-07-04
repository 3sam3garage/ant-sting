import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { EconomicInformationModule } from './economic-information';

@Module({
  imports: [CoreModule, EconomicInformationModule],
})
export class ConsumerModule {}
