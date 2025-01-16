import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortInterestRepository } from './repository';
import { ShortInterest } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShortInterest])],
  providers: [ShortInterestRepository],
  exports: [ShortInterestRepository],
})
export class ShortInterestDomainModule {}
