import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockAnalysisRepository } from '@libs/domain';
import { StockAnalysisResponse } from '../dto';
import { FindByDateQuery } from '../../common';

@Injectable()
export class StockAnalysisService {
  constructor(private readonly repo: StockAnalysisRepository) {}

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return StockAnalysisResponse.fromEntity(entity);
  }

  async findByDate(query: FindByDateQuery) {
    const { from, to } = query;

    const entities = await this.repo.findByDate(from, to);
    return entities.map((entity) => StockAnalysisResponse.fromEntity(entity));
  }

  async countByDate(query: FindByDateQuery) {
    const { from, to } = query;
    const count = await this.repo.countByDate(from, to);

    return { count };
  }
}
