import { Injectable } from '@nestjs/common';
import { MarketInfoReportRepository } from '@libs/domain';
import { ObjectId } from 'typeorm';

@Injectable()
export class MarketInfoReportService {
  constructor(private readonly repo: MarketInfoReportRepository) {}

  async findOne(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(date: string) {
    return this.repo.find({ where: { date } });
  }
}
