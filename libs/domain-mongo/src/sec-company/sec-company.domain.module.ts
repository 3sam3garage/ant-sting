import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecCompanyRepository } from './repository';
import { SecCompanyEntity } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecCompanyEntity])],
  providers: [SecCompanyRepository],
  exports: [SecCompanyRepository],
})
/**
 * @deprecated
 */
export class SecCompanyDomainModule {}
