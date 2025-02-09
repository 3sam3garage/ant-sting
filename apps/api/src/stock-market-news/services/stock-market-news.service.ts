import { Injectable } from '@nestjs/common';
import { StockMarketNewsRepository } from '@libs/domain';
import { FindStockMarketNewsQuery, StockMarketNewsResponse } from '../dto';

@Injectable()
export class StockMarketNewsService {
  constructor(
    private readonly stockMarketNewsRepo: StockMarketNewsRepository,
  ) {}

  async findByTicker({ ticker }: FindStockMarketNewsQuery) {
    const entities = await this.stockMarketNewsRepo.find({
      where: { tickers: { $in: [ticker] } },
    });

    return entities.map((entity) => {
      return StockMarketNewsResponse.fromEntity(entity);
    });
  }
}
