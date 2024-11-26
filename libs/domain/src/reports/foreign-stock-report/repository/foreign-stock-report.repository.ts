import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockReport } from '../entity';

@Injectable()
export class ForeignStockReportRepository extends MongoRepository<StockReport> {
  constructor(
    @InjectRepository(StockReport)
    private readonly repo: MongoRepository<StockReport>,
  ) {
    super(StockReport, repo.manager);
  }

  async findOneByUid(uuid: string) {
    return this.repo.findOne({ where: { uuid } });
  }
}
