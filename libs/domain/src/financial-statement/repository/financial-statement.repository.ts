import { Index, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialStatement } from '../entity';

@Index('종목코드', { unique: true })
@Injectable()
export class FinancialStatementRepository extends MongoRepository<FinancialStatement> {
  constructor(
    @InjectRepository(FinancialStatement)
    private readonly repo: MongoRepository<FinancialStatement>,
  ) {
    super(FinancialStatement, repo.manager);
  }

  async updateOne(
    entity: FinancialStatement,
    data: Partial<FinancialStatement>,
  ) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
