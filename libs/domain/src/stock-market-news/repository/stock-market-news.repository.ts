import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMarketNews } from '../entity';

@Injectable()
export class StockMarketNewsRepository extends MongoRepository<StockMarketNews> {
  constructor(
    @InjectRepository(StockMarketNews)
    private readonly repo: MongoRepository<StockMarketNews>,
  ) {
    super(StockMarketNews, repo.manager);
  }
}
