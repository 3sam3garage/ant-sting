import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestRate } from '../entity';
import { FindInterestRates } from '../interface';

@Injectable()
export class InterestRateRepository extends MongoRepository<InterestRate> {
  constructor(
    @InjectRepository(InterestRate)
    private readonly repo: MongoRepository<InterestRate>,
  ) {
    super(InterestRate, repo.manager);
  }

  async findByCountries(query: FindInterestRates) {
    const { from, to, countries } = query;
    return this.repo.find({
      where: {
        country: { $in: countries },
        date: { $gte: from, $lte: to },
      },
    });
  }
}
