import { Injectable } from '@nestjs/common';
import { FilingRepository } from '@libs/domain';
import { FilingResponse, FindFilingsQuery } from '../dto';

@Injectable()
export class FilingService {
  constructor(private readonly repo: FilingRepository) {}

  async findByTickers(query: FindFilingsQuery) {
    const filings = await this.repo.find({
      where: {
        ticker: { $in: [...query.tickers] },
        analysis: { $exists: true },
      },
    });

    return filings.map((filing) => FilingResponse.fromEntity(filing));
  }
}
