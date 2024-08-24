import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebentureReport } from '../entity';

@Injectable()
export class DebentureReportRepository extends MongoRepository<DebentureReport> {
  constructor(
    @InjectRepository(DebentureReport)
    private readonly repo: MongoRepository<DebentureReport>,
  ) {
    super(DebentureReport, repo.manager);
  }

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findOneByNid(nid: string) {
    return this.repo.findOne({ where: { nid } });
  }
}
