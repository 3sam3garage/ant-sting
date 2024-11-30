import { FilterOperators, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockAnalysis } from '../entity';
import { MARKET_POSITION } from '@libs/domain/constants';
import { FindAnalysisByDate } from '@libs/domain/stock-report/interfaces';

@Injectable()
export class StockAnalysisRepository extends MongoRepository<StockAnalysis> {
  constructor(
    @InjectRepository(StockAnalysis)
    private readonly repo: MongoRepository<StockAnalysis>,
  ) {
    super(StockAnalysis, repo.manager);
  }

  async findByDate(query: FindAnalysisByDate) {
    const { from, to, aiSuggestion, reportSuggestion } = query;

    const filterQuery: FilterOperators<StockAnalysis> = {
      where: {
        date: { $gte: from, $lte: to },
      },
    };

    if (aiSuggestion) {
      filterQuery.where['aiAnalysis.position'] = aiSuggestion;
    }

    if (reportSuggestion) {
      filterQuery.where['reportAnalysis.position'] = reportSuggestion;
    }

    return this.repo.find(filterQuery);
  }

  async findRecommendedStocksByDate(from: Date, to: Date) {
    return this.repo.find({
      where: {
        'reportAnalysis.position': MARKET_POSITION.BUY,
        'aiAnalysis.position': MARKET_POSITION.BUY,
        date: { $gte: from, $lte: to },
      },
    });
  }

  async countByDate(from: Date, to: Date) {
    return this.repo.count({
      date: { $gte: from, $lte: to },
    });
  }
}
