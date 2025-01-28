import { FilterOperators, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAnalysisByDate } from '@libs/domain/stock-report';
import { StockMarketNews } from '../entity';

@Injectable()
export class StockMarketNewsRepository extends MongoRepository<StockMarketNews> {
  constructor(
    @InjectRepository(StockMarketNews)
    private readonly repo: MongoRepository<StockMarketNews>,
  ) {
    super(StockMarketNews, repo.manager);
  }

  async findByDate(query: FindAnalysisByDate) {
    const { from, to, aiSuggestion, reportSuggestion } = query;

    const filterQuery: FilterOperators<StockMarketNews> = {
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

    const filterQuery: FilterOperators<StockMarketNews> = {
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
