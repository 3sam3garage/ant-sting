import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilingRepository } from './repository';
import { Filing } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Filing])],
  providers: [FilingRepository],
  exports: [FilingRepository],
})
export class FilingDomainModule {}
