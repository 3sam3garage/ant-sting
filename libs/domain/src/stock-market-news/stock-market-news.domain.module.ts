import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMarketNews } from './entity';
import { StockMarketNewsRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([StockMarketNews])],
  providers: [StockMarketNewsRepository],
  exports: [StockMarketNewsRepository],
})
export class StockMarketNewsDomainModule {}
