import { Injectable } from '@nestjs/common';
import { Ticker, TickerRepository } from '@libs/domain';
import { SecApiService } from '@libs/external-api';

@Injectable()
export class SecTickerFetcher {
  private readonly url = 'https://www.sec.gov/files/company_tickers.json';

  constructor(
    private readonly tickerRepository: TickerRepository,
    private readonly secApiService: SecApiService,
  ) {}

  async exec() {
    const response = await this.secApiService.fetchCompanyTickers();

    for (const [, item] of Object.entries(response || {})) {
      const { ticker, cik_str: cik, title: stockName } = item;
      const entity = Ticker.create({ ticker, cik, stockName });

      const foundEntity = await this.tickerRepository.findOne({
        where: { ticker },
      });
      if (foundEntity) {
        await this.tickerRepository.save(Object.assign(foundEntity, entity));
      } else {
        await this.tickerRepository.save(entity);
      }
    }
  }
}
