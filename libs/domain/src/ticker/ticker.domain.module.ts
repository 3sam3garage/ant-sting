import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TickerRepository } from './repository';
import { Ticker } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker])],
  providers: [TickerRepository],
  exports: [TickerRepository],
})
export class TickerDomainModule {}
