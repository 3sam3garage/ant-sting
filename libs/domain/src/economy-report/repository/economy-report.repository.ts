import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EconomyReport } from '../entity';

@Injectable()
export class EconomyReportRepository extends MongoRepository<EconomyReport> {
  constructor(
    @InjectRepository(EconomyReport)
    private readonly repo: MongoRepository<EconomyReport>,
  ) {
    super(EconomyReport, repo.manager);
  }

  async createOne(data: EconomyReport) {
    return this.repo.save(data);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findOneByNid(nid: string) {
    return this.repo.findOne({ where: { nid } });
  }

  async updateOne(entity: EconomyReport, data: Partial<EconomyReport>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
