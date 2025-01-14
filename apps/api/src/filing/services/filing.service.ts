import { Injectable } from '@nestjs/common';
import { FilingRepository } from '@libs/domain';
import { FilingResponse, FindFilingsQuery } from '../dto';
import { FindManyOptions, ObjectId } from 'typeorm';

@Injectable()
export class FilingService {
  constructor(private readonly repo: FilingRepository) {}

  async findByTickers(query: FindFilingsQuery) {
    // const { from, to } = query;

    const filterQuery: FindManyOptions = {
      where: {
        analysis: { $exists: true },
        // date: { $gte: from, $lte: to },
      },
    };

    if (query.tickers.length > 0) {
      filterQuery.where['ticker'] = { $in: [...query.tickers] };
    }

    const filings = await this.repo.find(filterQuery);

    return filings.map((filing) => FilingResponse.fromEntity(filing));
  }

  async findOneById(_id: ObjectId) {
    const entity = await this.repo.findOne({ where: { _id } });
    return FilingResponse.fromEntity(entity);
  }
}
