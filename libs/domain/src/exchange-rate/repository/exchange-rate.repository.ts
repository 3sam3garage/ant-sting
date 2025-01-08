import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../entity';
import { FindExchangeRates } from '../interfaces';

@Injectable()
export class ExchangeRateRepository extends MongoRepository<ExchangeRate> {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly repo: MongoRepository<ExchangeRate>,
  ) {
    super(ExchangeRate, repo.manager);
  }

  async findByDate(query: FindExchangeRates) {
    const { from, to, currency } = query;
    return this.repo.find({
      where: {
        targetCurrency: { $in: currency },
        date: { $gte: from, $lte: to },
      },
    });
  }
}
