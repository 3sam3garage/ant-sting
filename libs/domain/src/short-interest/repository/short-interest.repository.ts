import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortInterest } from '../entity';

@Injectable()
export class ShortInterestRepository extends MongoRepository<ShortInterest> {
  constructor(
    @InjectRepository(ShortInterest)
    private readonly repo: MongoRepository<ShortInterest>,
  ) {
    super(ShortInterest, repo.manager);
  }
}
