import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockAnalysisRepository } from '@libs/domain';
import { FindAnalysisQuery, StockAnalysisResponse } from '../dto';

@Injectable()
export class StockAnalysisService {
  constructor(private readonly repo: StockAnalysisRepository) {}

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return StockAnalysisResponse.fromEntity(entity);
  }

  async findByDate(query: FindAnalysisQuery) {
    const entities = await this.repo.findByDate({ ...query });
    return entities.map((entity) => StockAnalysisResponse.fromEntity(entity));
  }
}
