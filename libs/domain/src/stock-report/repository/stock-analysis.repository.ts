import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockAnalysis } from '../entity';
import { MARKET_POSITION } from '../../constants';

@Injectable()
export class StockAnalysisRepository extends MongoRepository<StockAnalysis> {
  constructor(
    @InjectRepository(StockAnalysis)
    private readonly repo: MongoRepository<StockAnalysis>,
  ) {
    super(StockAnalysis, repo.manager);
  }

  findRecommendAnalysisByDate(date: string): Promise<StockAnalysis[]> {
    return this.find({
      where: {
        'reportAnalysis.position': MARKET_POSITION.BUY,
        'aiAnalysis.position': MARKET_POSITION.BUY,
        date,
      },
    });
  }

  findForeignRecommendAnalysisByDate(date: string): Promise<StockAnalysis[]> {
    return this.find({
      where: {
        'reportAnalysis.position': MARKET_POSITION.BUY,
        'aiAnalysis.position': MARKET_POSITION.BUY,
        market: { $ne: 'KR' },
        date,
      },
    });
  }

  async findByDate(from: Date, to: Date) {
    return this.repo.find({
      where: {
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
