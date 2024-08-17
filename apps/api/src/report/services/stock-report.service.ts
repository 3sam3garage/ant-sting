import { Injectable } from '@nestjs/common';
import { StockReportRepository } from '@libs/domain';
import { ObjectId } from 'typeorm';

@Injectable()
export class StockReportService {
  constructor(private readonly repo: StockReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }
}
