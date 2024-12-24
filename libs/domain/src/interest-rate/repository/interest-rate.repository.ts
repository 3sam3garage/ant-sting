import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestRate } from '../entity';

@Injectable()
export class InterestRateRepository extends MongoRepository<InterestRate> {
  constructor(
    @InjectRepository(InterestRate)
    private readonly repo: MongoRepository<InterestRate>,
  ) {
    super(InterestRate, repo.manager);
  }
}
