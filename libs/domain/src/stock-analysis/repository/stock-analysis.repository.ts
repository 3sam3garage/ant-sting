import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockAnalysis } from '../entity';

@Injectable()
export class StockAnalysisRepository extends MongoRepository<StockAnalysis> {
  constructor(
    @InjectRepository(StockAnalysis)
    private readonly repo: MongoRepository<StockAnalysis>,
  ) {
    super(StockAnalysis, repo.manager);
  }
}
