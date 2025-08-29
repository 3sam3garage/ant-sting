import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioRepository } from './repository';
import { Portfolio } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  providers: [PortfolioRepository],
  exports: [PortfolioRepository],
})
export class PortfolioDomainModule {}
