import { Inject, Injectable } from '@nestjs/common';
import { MONGO_REPOSITORY_TOKEN } from '@libs/application';
import { subDays, format } from 'date-fns/fp';
import { flow } from 'lodash/fp';
import {
  Portfolio,
  PortfolioItem,
  PortfolioRepositoryImpl,
} from '@libs/domain';
import { ObjectId } from 'mongodb';

@Injectable()
export class FigureAnalysisInPeriodService {
  constructor(
    @Inject(MONGO_REPOSITORY_TOKEN.PORTFOLIO)
    private readonly portfolioRepository: PortfolioRepositoryImpl,
  ) {}

  private figureMostRetain(portfolios: Portfolio[]) {
    const countMap = new Map<string, number>();

    for (const portfolio of portfolios) {
      for (const item of portfolio?.items || []) {
        const prev = countMap.get(item.cusip) || 0;
        countMap.set(item.cusip, prev + 1);
      }
    }

    const cusips = [...countMap].sort((a, b) => b[1] - a[1]);
    return cusips.slice(0, 10);
  }

  private figureMostValued(portfolios: Portfolio[]) {
    const valueMap = new Map<string, number>();

    for (const portfolio of portfolios) {
      for (const item of portfolio?.items || []) {
        const prev = valueMap.get(item.cusip) || 0;
        valueMap.set(item.cusip, prev + item.value);
      }
    }

    const values = [...valueMap].sort((a, b) => b[1] - a[1]);
    return values.slice(0, 10);
  }

  private async figureNewlyAcquired(portfolios: Portfolio[]) {
    const acquireMap = new Map<string, number>();
    const disposeMap = new Map<string, number>();

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
        const { added, removed } = Portfolio.figureAddedAndRemoved(
          current,
          prev,
        );
        for (const item of added) {
          const prev = acquireMap.get(item.cusip) || 0;
          acquireMap.set(item.cusip, prev + 1);
        }

        for (const item of removed) {
          const prev = disposeMap.get(item.cusip) || 0;
          disposeMap.set(item.cusip, prev + 1);
        }
      }
    }

    const acquires = [...acquireMap].sort((a, b) => b[1] - a[1]);
    // return values.slice(0, 10);

    const disposed = [...disposeMap].sort((a, b) => b[1] - a[1]);
    // return values.slice(0, 10);

    return {
      acquired: acquires.slice(0, 10),
      disposed: disposed.slice(0, 10),
    };
  }

  async exec(period: number) {
    const date = new Date();
    const start = flow(subDays(period), format('yyyy-MM-dd'))(date);
    const end = format('yyyy-MM-dd', date);

    const portfolios = await this.portfolioRepository.findByPeriod(start, end);
    const [retain, valued, { acquired, disposed }] = await Promise.all([
      this.figureMostRetain(portfolios),
      this.figureMostValued(portfolios),
      await this.figureNewlyAcquired(portfolios),
    ]);

    const stockMap = new Map<string, PortfolioItem>();
    for (const portfolio of portfolios) {
      for (const item of portfolio?.items || []) {
        stockMap.set(item.cusip, item);
      }
    }

    return {
      acquired: acquired.map(([cusip, count]) => {
        return { name: stockMap.get(cusip).name + ` (${cusip})`, count };
      }),
      disposed: disposed.map(([cusip, count]) => {
        return { name: stockMap.get(cusip)?.name + ` (${cusip})`, count };
      }),
      retain: retain.map(([cusip, count]) => {
        return { name: stockMap.get(cusip).name + ` (${cusip})`, count };
      }),
      valued: valued.map(([cusip, value]) => {
        return { name: stockMap.get(cusip).name + ` (${cusip})`, value };
      }),
    };
  }
}
