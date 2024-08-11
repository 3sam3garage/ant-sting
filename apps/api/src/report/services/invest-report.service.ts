import { Injectable } from '@nestjs/common';
import { InvestReportRepository } from '@libs/domain';
import { ObjectId } from 'typeorm';

@Injectable()
export class InvestReportService {
  constructor(private readonly repo: InvestReportRepository) {}

  async findOne(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }
}
