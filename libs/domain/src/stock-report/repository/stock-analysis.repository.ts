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
}
