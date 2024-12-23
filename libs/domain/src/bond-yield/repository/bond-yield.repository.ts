import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BondYield } from '../entity';

@Injectable()
export class BondYieldRepository extends MongoRepository<BondYield> {
  constructor(
    @InjectRepository(BondYield)
    private readonly repo: MongoRepository<BondYield>,
  ) {
    super(BondYield, repo.manager);
  }
}
