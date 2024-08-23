import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DebentureReportRepository } from '@libs/domain';

@Injectable()
export class DebentureReportService {
  constructor(private readonly repo: DebentureReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }
}
