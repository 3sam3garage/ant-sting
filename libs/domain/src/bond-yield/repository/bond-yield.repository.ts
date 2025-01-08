import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BondYield } from '../entity';
import { FindBondYields } from '../interfaces';

@Injectable()
export class BondYieldRepository extends MongoRepository<BondYield> {
  constructor(
    @InjectRepository(BondYield)
    private readonly repo: MongoRepository<BondYield>,
  ) {
    super(BondYield, repo.manager);
  }

  async findByDate(query: FindBondYields) {
    const { from, to, countries } = query;
    return this.repo.find({
      where: {
        country: { $in: countries },
        date: { $gte: from, $lte: to },
      },
    });
  }
}
