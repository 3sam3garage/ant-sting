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

  async countByDate(query: FindAnalysisByDate) {
    const { from, to, aiSuggestion, reportSuggestion } = query;

    const filterQuery: FilterOperators<StockAnalysis> = {
      date: { $gte: from, $lte: to },
    };

    if (aiSuggestion) {
      filterQuery['aiAnalysis.position'] = aiSuggestion;
    }

    if (reportSuggestion) {
      filterQuery['reportAnalysis.position'] = reportSuggestion;
    }

    return this.repo.count(filterQuery);
  }
}
