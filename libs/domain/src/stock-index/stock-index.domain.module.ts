import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockIndexRepository } from './repository';
import { StockIndex } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockIndex])],
  providers: [StockIndexRepository],
  exports: [StockIndexRepository],
})
export class StockIndexDomainModule {}
