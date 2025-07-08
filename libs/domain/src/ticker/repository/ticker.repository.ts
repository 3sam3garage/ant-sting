import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticker } from '../entity';

@Injectable()
export class TickerRepository extends MongoRepository<Ticker> {
  constructor(
    @InjectRepository(Ticker)
    private readonly repo: MongoRepository<Ticker>,
  ) {
    super(Ticker, repo.manager);
  }
}
