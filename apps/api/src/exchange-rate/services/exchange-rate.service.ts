import { Injectable } from '@nestjs/common';
import { ExchangeRateRepository } from '@libs/domain';
import { FindExchangeRatesQuery } from '../dto';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly repo: ExchangeRateRepository) {}

  async findByDate(query: FindExchangeRatesQuery) {
    return await this.repo.findByDate(query);
  }
}
