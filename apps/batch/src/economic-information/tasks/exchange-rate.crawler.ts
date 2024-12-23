import { Injectable } from '@nestjs/common';
import { ExchangeRateRepository } from '@libs/domain';

@Injectable()
export class ExchangeRateCrawler {
  constructor(private readonly repo: ExchangeRateRepository) {}

  async exec() {}
}
