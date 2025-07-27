import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity';

@Injectable()
export class PortfolioRepository extends MongoRepository<Portfolio> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly repo: MongoRepository<Portfolio>,
  ) {
    super(Portfolio, repo.manager);
  }
}
