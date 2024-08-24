import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporationRepository } from './repository';
import { Corporation } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Corporation])],
  providers: [CorporationRepository],
  exports: [CorporationRepository],
})
export class CorporationDomainModule {}
