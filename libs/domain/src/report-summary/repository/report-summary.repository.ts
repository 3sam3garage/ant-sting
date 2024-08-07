import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportSummary } from '../entity';

@Injectable()
export class ReportSummaryRepository extends MongoRepository<ReportSummary> {
  constructor(
    @InjectRepository(ReportSummary)
    private readonly repo: MongoRepository<ReportSummary>,
  ) {
    super(ReportSummary, repo.manager);
  }

  async createOne(data: ReportSummary) {
    return this.repo.save(data);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async updateOne(entity: ReportSummary, data: Partial<ReportSummary>) {
    Object.assign(entity, data);
    return this.repo.save(entity);
  }
}
