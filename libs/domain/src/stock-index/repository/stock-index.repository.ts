import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockIndex } from '../entity';

@Injectable()
export class StockIndexRepository extends MongoRepository<StockIndex> {
  constructor(
    @InjectRepository(StockIndex)
    private readonly repo: MongoRepository<StockIndex>,
  ) {
    super(StockIndex, repo.manager);
  }
}
