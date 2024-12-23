import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from '../entity';

@Injectable()
export class ExchangeRateRepository extends MongoRepository<ExchangeRate> {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly repo: MongoRepository<ExchangeRate>,
  ) {
    super(ExchangeRate, repo.manager);
  }
}
