import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockReportRepository } from '@libs/domain';
import { FindStockQuery, StockReportResponse } from '../dto';

@Injectable()
export class StockReportService {
  constructor(private readonly repo: StockReportRepository) {}

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return StockReportResponse.fromEntity(entity);
  }

  async findByDate(query: FindStockQuery) {
    const { from, to, code } = query;
    const entities = await this.repo.findByDate({ from, to, code });

    return entities.map((entity) => StockReportResponse.fromEntity(entity));
  }

  async countByDate(query: FindStockQuery): Promise<{ count: number }> {
    const count = await this.repo.countByDate(query);

    return { count };
  }
}
