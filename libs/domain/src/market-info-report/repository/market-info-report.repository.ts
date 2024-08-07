import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketInfoReport } from '../entity';

@Injectable()
export class MarketInfoReportRepository extends MongoRepository<MarketInfoReport> {
  constructor(
    @InjectRepository(MarketInfoReport)
    private readonly repo: MongoRepository<MarketInfoReport>,
  ) {
    super(MarketInfoReport, repo.manager);
  }

  async createOne(data: MarketInfoReport) {
    return this.repo.save(data);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findOneByNid(nid: string) {
    return this.repo.findOne({ where: { nid } });
  }

  async updateOne(entity: MarketInfoReport, data: Partial<MarketInfoReport>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
