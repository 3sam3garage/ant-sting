import { ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StockAnalysisRepository } from '@libs/domain';
import { FindAnalysisQuery, StockAnalysisResponse } from '../dto';
import { countBy } from 'lodash';
import { FindByDateQuery } from '../../common';

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

  async countByDate(query: FindAnalysisQuery) {
    const count = await this.repo.countByDate({ ...query });

    return { count };
  }

  async figureShare(query: FindAnalysisQuery) {
    const reports = await this.repo.findByDate({ ...query });
    const share = countBy(reports, ({ aiAnalysis, reportAnalysis }) => {
      return `${reportAnalysis.position} : ${aiAnalysis.position}`;
    });

    return { share };
  }

  async countByAnalysis(query: FindByDateQuery) {
    const analysis = await this.repo.findByDate(query);
    const share = countBy(analysis, 'stockCode');

    const map = new Map();
    for (const item of analysis) {
      map.set(item.stockCode, item.stockName);
    }

    const items = [];
    for (const [key, value] of Object.entries(share)) {
      const name = map.get(key);
      items.push({ name: `${name} (${key})`, value });
    }

    return { items };
  }
}
