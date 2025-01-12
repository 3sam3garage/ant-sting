import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { SEC_FAIR_ACCESS_HEADERS } from '../constants';
import { SecTickerResponse } from '../interface';
import { Ticker, TickerRepository } from '@libs/domain';

@Injectable()
export class SecTickerFetcher {
  private readonly url = 'https://www.sec.gov/files/company_tickers.json';

  constructor(private readonly tickerRepository: TickerRepository) {}

  async exec() {
    const res = await axios.get<SecTickerResponse>(this.url, {
      headers: SEC_FAIR_ACCESS_HEADERS,
    });

    for (const [, item] of Object.entries(res.data || {})) {
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
