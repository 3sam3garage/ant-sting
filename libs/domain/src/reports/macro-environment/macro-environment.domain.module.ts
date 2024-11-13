import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MacroEnvironmentRepository } from './repository';
import { MacroEnvironment } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([MacroEnvironment])],
  providers: [MacroEnvironmentRepository],
  exports: [MacroEnvironmentRepository],
})
export class MacroEnvironmentDomainModule {}
