import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockIndex } from '../entity';
import { FindStockIndexes } from '../interface';

@Injectable()
export class StockIndexRepository extends MongoRepository<StockIndex> {
  constructor(
    @InjectRepository(StockIndex)
    private readonly repo: MongoRepository<StockIndex>,
  ) {
    super(StockIndex, repo.manager);
  }

  async findByCountries(query: FindStockIndexes) {
    const { from, to, countries } = query;
    return this.repo.find({
      where: {
        country: { $in: countries },
        date: { $gte: from, $lte: to },
      },
    });
  }
}
