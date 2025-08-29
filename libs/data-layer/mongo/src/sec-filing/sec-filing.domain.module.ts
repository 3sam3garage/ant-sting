import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecFilingRepository } from './repository';
import { SecFiling } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecFiling])],
  providers: [SecFilingRepository],
  exports: [SecFilingRepository],
})
export class SecFilingDomainModule {}
