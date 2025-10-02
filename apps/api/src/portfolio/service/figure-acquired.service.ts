import { Inject, Injectable } from '@nestjs/common';
import { MONGO_REPOSITORY_TOKEN } from '@libs/application';
import { subDays, format } from 'date-fns/fp';
import { flow } from 'lodash/fp';
import { Portfolio, PortfolioRepositoryImpl } from '@libs/domain';
import { ObjectId } from 'mongodb';

@Injectable()
export class FigureAcquiredService {
  constructor(
    @Inject(MONGO_REPOSITORY_TOKEN.PORTFOLIO)
    private readonly portfolioRepository: PortfolioRepositoryImpl,
  ) {}

  private async figureAcquired(portfolios: Portfolio[]) {
    const nameMap = new Map<string, string>();
    const acquireMap = new Map<string, number>();
    const acquireValueMap = new Map<string, number>();

    const tasks = portfolios.map((portfolio) => {
      return this.portfolioRepository.findOnePreviousByIdAndIssuer(
        new ObjectId(portfolio._id),
        portfolio.issuer,
      );
    });

    const prevPortfolios = await Promise.all(tasks);
    for (let i = 0; i < portfolios.length; i++) {
      const current = portfolios[i];
      const prev = prevPortfolios[i];

      if (current && prev) {
        const { added } = Portfolio.figureAddedAndRemoved(current, prev);
        for (const item of added) {
          // 취득한 기관 수
          const prev = acquireMap.get(item.cusip) || 0;
          acquireMap.set(item.cusip, prev + 1);

          // 총액
          const prevValue = acquireValueMap.get(item.cusip) || 0;
          acquireValueMap.set(item.cusip, prevValue + item.value);

          // 이름
          nameMap.set(item.cusip, item.name);
        }
      }
    }

    const acquired = [...acquireMap].sort((a, b) => b[1] - a[1]);

    return acquired.slice(0, 10).map(([cusip, count]) => {
      return {
        cusip,
        count,
        value: '$' + acquireValueMap.get(cusip).toLocaleString(),
        name: nameMap.get(cusip),
      };
    });
  }

  async exec(period: number) {
    const date = new Date();
    const start = flow(subDays(period), format('yyyy-MM-dd'))(date);
    const end = format('yyyy-MM-dd', date);

    const portfolios = await this.portfolioRepository.findByPeriod(start, end);
    const acquired = await this.figureAcquired(portfolios);

    return {
      acquired,
    };
  }
}
