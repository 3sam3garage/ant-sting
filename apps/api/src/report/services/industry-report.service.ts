import { Injectable } from '@nestjs/common';
import { IndustryReportRepository } from '@libs/domain';
import { ObjectId } from 'typeorm';

@Injectable()
export class IndustryReportService {
  constructor(private readonly repo: IndustryReportRepository) {}

  async findOne(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }
}
