import { Inject, Injectable } from '@nestjs/common';
import { MONGO_REPOSITORY_TOKEN } from '@libs/application';
import { subDays, format } from 'date-fns/fp';
import { flow } from 'lodash/fp';
import { PortfolioRepositoryImpl } from '@libs/domain';

@Injectable()
export class FigureMostRetainService {
  constructor(
    @Inject(MONGO_REPOSITORY_TOKEN.PORTFOLIO)
    private readonly portfolioRepository: PortfolioRepositoryImpl,
  ) {}

  async exec(period: number) {
    const date = new Date();
    const start = flow(subDays(period), format('yyyy-MM-dd'))(date);
    const end = format('yyyy-MM-dd', date);

    const portfolios = await this.portfolioRepository.findByPeriod(start, end);

    return null as never;
    // this.portfolioRepository.
  }
}
