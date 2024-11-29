import { MongoRepository } from 'typeorm';
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

  async findOneByUid(uuid: string) {
    return this.repo.findOne({ where: { uuid } });
  }

  async findByDate(from: Date, to: Date) {
    return this.repo.find({
      where: {
        date: { $gte: from, $lte: to },
      },
    });
  }

  async countByDate(from: Date, to: Date) {
    return this.repo.count({
      date: { $gte: from, $lte: to },
    });
  }
}
