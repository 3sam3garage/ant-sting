import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BondYieldRepository } from './repository';
import { BondYield } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([BondYield])],
  providers: [BondYieldRepository],
  exports: [BondYieldRepository],
})
export class BondYieldDomainModule {}
