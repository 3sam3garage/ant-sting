import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateRepository } from './repository';
import { ExchangeRate } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  providers: [ExchangeRateRepository],
  exports: [ExchangeRateRepository],
})
export class ExchangeRateDomainModule {}
