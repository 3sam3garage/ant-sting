import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../entity';
import { eachMonthOfInterval } from 'date-fns';

@Injectable()
export class ExchangeRateRepository extends MongoRepository<ExchangeRate> {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly repo: MongoRepository<ExchangeRate>,
  ) {
    super(ExchangeRate, repo.manager);
  }

  pickInMonths(
    { startDate, endDate }: { startDate: string; endDate: string },
    options = {},
  ) {
    const dates = eachMonthOfInterval({ start: startDate, end: endDate });

    console.log(dates, options);
  }
}
