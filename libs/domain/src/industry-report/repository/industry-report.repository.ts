import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IndustryReport } from '../entity';

@Injectable()
export class IndustryReportRepository extends MongoRepository<IndustryReport> {
  constructor(
    @InjectRepository(IndustryReport)
    private readonly repo: MongoRepository<IndustryReport>,
  ) {
    super(IndustryReport, repo.manager);
  }

  async createOne(data: IndustryReport) {
    return this.repo.save(data);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findOneByNid(nid: string) {
    return this.repo.findOne({ where: { nid } });
  }

  async updateOne(entity: IndustryReport, data: Partial<IndustryReport>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
