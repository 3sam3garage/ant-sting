import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestRateRepository } from './repository';
import { InterestRate } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterestRate])],
  providers: [InterestRateRepository],
  exports: [InterestRateRepository],
})
export class InterestRateDomainModule {}
