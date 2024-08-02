import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestReport } from '../entity';

@Injectable()
export class InvestReportRepository extends MongoRepository<InvestReport> {
  constructor(
    @InjectRepository(InvestReport)
    private readonly repo: MongoRepository<InvestReport>,
  ) {
    super(InvestReport, repo.manager);
  }

  async createOne(data: InvestReport) {
    return this.repo.insertOne(data);
  }
}
