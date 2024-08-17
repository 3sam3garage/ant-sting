import { Injectable } from '@nestjs/common';
import { EconomyReportRepository } from '@libs/domain';
import { ObjectId } from 'typeorm';

@Injectable()
export class EconomyReportService {
  constructor(private readonly repo: EconomyReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }
}
