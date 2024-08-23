import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockReport } from '../entity';

@Injectable()
export class StockReportRepository extends MongoRepository<StockReport> {
  constructor(
    @InjectRepository(StockReport)
    private readonly repo: MongoRepository<StockReport>,
  ) {
    super(StockReport, repo.manager);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findOneByNid(nid: string) {
    return this.repo.findOne({ where: { nid } });
  }
}
