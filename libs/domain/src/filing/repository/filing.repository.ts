import { FindManyOptions, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filing } from '../entity';
import { FindFilingQuery } from '@libs/domain/filing/interfaces';

@Injectable()
export class FilingRepository extends MongoRepository<Filing> {
  constructor(
    @InjectRepository(Filing)
    private readonly repo: MongoRepository<Filing>,
  ) {
    super(Filing, repo.manager);
  }

  async findFilingsWithAnalysis(query: FindFilingQuery) {
    const filterQuery: FindManyOptions = {
      where: {
        analysis: { $exists: true },
        // date: { $gte: from, $lte: to },
      },
    };

    if (query.tickers.length > 0) {
      filterQuery.where['ticker'] = { $in: [...query.tickers] };
    }

    if (query.formTypes.length > 0) {
      filterQuery.where['formType'] = { $in: [...query.formTypes] };
    }

    return await this.repo.find(filterQuery);
  }
}
