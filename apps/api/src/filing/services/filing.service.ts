import { Injectable } from '@nestjs/common';
import { FilingRepository } from '@libs/domain';
import { FindFilingsQuery } from '../dto';

@Injectable()
export class FilingService {
  constructor(private readonly repo: FilingRepository) {}

  async findByTickers(query: FindFilingsQuery) {
    return await this.repo.find({
      where: {
        ticker: { $in: [...query.tickers] },
      },
    });
  }
}
