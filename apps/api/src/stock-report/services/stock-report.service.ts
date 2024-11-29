import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockReportRepository } from '@libs/domain';
import { FindByDateQuery } from '../../common';

@Injectable()
export class StockReportService {
  constructor(private readonly repo: StockReportRepository) {}

  async findOneById(_id: ObjectId) {
    return this.repo.findOne({ where: { _id } });
  }

  async findByDate(query: FindByDateQuery) {
    const { from, to } = query;
    return await this.repo.findByDate(from, to);
  }

  async countByDate(query: FindByDateQuery) {
    const { from, to } = query;
    const count = await this.repo.countByDate(from, to);

    return { count };
  }
}
