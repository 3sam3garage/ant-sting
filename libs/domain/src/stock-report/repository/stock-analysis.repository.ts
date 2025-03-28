import { FilterOperators, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAnalysisByDate } from '@libs/domain/stock-report';
import { StockAnalysis } from '../entity';

@Injectable()
export class StockAnalysisRepository extends MongoRepository<StockAnalysis> {
  constructor(
    @InjectRepository(StockAnalysis)
    private readonly repo: MongoRepository<StockAnalysis>,
  ) {
    super(StockAnalysis, repo.manager);
  }

  async findByDate(query: FindAnalysisByDate) {
    const { from, to, stockCode } = query;

    const filterQuery: FilterOperators<StockAnalysis> = {
      where: {},
    };

    if (stockCode) {
      filterQuery.where = { ...filterQuery.where, stockCode };
    }

    if (from && to) {
      filterQuery.where.date = { $gte: from, $lte: to };
    }

    return this.repo.find(filterQuery);
  }
}
