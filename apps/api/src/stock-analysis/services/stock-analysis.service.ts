import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockAnalysisRepository } from '@libs/domain';
import { StockAnalysisResponse } from '../dto';

@Injectable()
export class StockAnalysisService {
  constructor(private readonly repo: StockAnalysisRepository) {}

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return StockAnalysisResponse.fromEntity(entity);
  }

  async findByDate(date: string) {
    const entities = await this.repo.find({ where: { date } });
    return entities.map((entity) => StockAnalysisResponse.fromEntity(entity));
  }
}
