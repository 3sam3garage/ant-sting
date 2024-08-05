import { MongoRepository, ObjectId } from 'typeorm';
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
    return this.repo.save(data);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findOneByNid(nid: string) {
    return this.repo.findOne({ where: { nid } });
  }

  async updateOne(entity: InvestReport, data: Partial<InvestReport>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
