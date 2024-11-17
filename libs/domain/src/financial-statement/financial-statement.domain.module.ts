import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialStatementRepository } from './repository';
import { FinancialStatement } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialStatement])],
  providers: [FinancialStatementRepository],
  exports: [FinancialStatementRepository],
})
export class FinancialStatementDomainModule {}
