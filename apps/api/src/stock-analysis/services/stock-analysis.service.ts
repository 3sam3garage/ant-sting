import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockAnalysisRepository } from '@libs/domain';
import { FindAnalysisQuery, StockAnalysisResponse } from '../dto';
import { FindByDateQuery } from '../../common';
import { countBy } from 'lodash';

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

  async countByDate(query: FindByDateQuery) {
    const { from, to } = query;
    const count = await this.repo.countByDate(from, to);

    return { count };
  }

  async figureShare(query: FindByDateQuery) {
    const reports = await this.repo.findByDate(query);
    const share = countBy(reports, 'market');

    return { share };
  }
}
