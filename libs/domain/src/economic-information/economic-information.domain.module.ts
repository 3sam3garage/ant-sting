import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomicInformationRepository } from './repository';
import { EconomicInformation } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([EconomicInformation])],
  providers: [EconomicInformationRepository],
  exports: [EconomicInformationRepository],
})
export class EconomicInformationDomainModule {}
