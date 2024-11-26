import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForeignStockReport } from '../entity';

@Injectable()
export class ForeignStockReportRepository extends MongoRepository<ForeignStockReport> {
  constructor(
    @InjectRepository(ForeignStockReport)
    private readonly repo: MongoRepository<ForeignStockReport>,
  ) {
    super(ForeignStockReport, repo.manager);
  }

  async findOneByUid(uuid: string) {
    return this.repo.findOne({ where: { uuid } });
  }
}
