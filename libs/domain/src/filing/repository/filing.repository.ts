import { FilterOperators, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filing } from '../entity';
import { FindFilingQuery } from '@libs/domain/filing/interfaces';

@Injectable()
export class FilingRepository extends MongoRepository<Filing> {
  private readonly QUERY_LIMIT = 1000;

  constructor(
    @InjectRepository(Filing)
    private readonly repo: MongoRepository<Filing>,
  ) {
    super(Filing, repo.manager);
  }

  async findByDate(query: FindFilingQuery) {
    const { from, to, tickers, formTypes, withAnalysis } = query;

    const filterQuery: FilterOperators<Filing> = {
      where: {},
    };

    if (from && to) {
      filterQuery.where.date = { $gte: from, $lte: to };
    }

    if (tickers.length > 0) {
      filterQuery.where = {
        ...filterQuery.where,
        ticker: { $in: tickers },
      };
    }

    if (formTypes.length > 0) {
      filterQuery.where = {
        ...filterQuery.where,
        formTypes: { $in: formTypes },
      };
    }

    if (withAnalysis) {
      filterQuery.where = { ...filterQuery.where, analysis: { $exists: true } };
    }

    return await this.repo.find({ ...filterQuery, take: this.QUERY_LIMIT });
  }
}
