import { Inject, Injectable } from '@nestjs/common';
import {
  Filing,
  FilingRepository,
  SEC_FILING_URL_SET,
  TickerRepository,
} from '@libs/domain';
import { SecApiService } from '@libs/external-api';
import { REDIS_NAME } from '@libs/config';
import { Redis } from 'ioredis';
import { format } from 'date-fns';

@Injectable()
export class ScrapeRssFetcher {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly tickerRepository: TickerRepository,
    private readonly filingRepository: FilingRepository,
    private readonly secApiService: SecApiService,
  ) {}

  private figureCIKFromTitle(title: string): number {
    const [match] = title.match(/(?<=\()\d{10}(?=\))/);
    return +match;
  }

  async exec() {
    const rss = await this.secApiService.fetchRSS();
    const feeds = rss?.feed?.entry || [];

    for (const feed of feeds) {
      const url = feed?.link?.$?.href || '';
      if (await this.redis.sismember(SEC_FILING_URL_SET, url)) {
        continue;
      }

      const cik = this.figureCIKFromTitle(feed.title);
      const formType = feed?.category?.$?.term;
      const date = format(new Date(feed.updated), 'yyyy-MM-dd'); // KST
      const tickerEntity = await this.tickerRepository.findOne({
        where: { cik },
      });

      // `ticker`가 없는 종목일 경우
      if (!tickerEntity) {
        await this.redis.sadd(SEC_FILING_URL_SET, url);
        continue;
      }

      // `filing`이 이미 존재하는 경우
      const foundFiling = await this.filingRepository.findOne({
        where: { url },
      });
      if (foundFiling) {
        await this.redis.sadd(SEC_FILING_URL_SET, url);
        continue;
      }

      const ticker = tickerEntity?.ticker;
      const entity = Filing.create({ url, cik, ticker, formType, date });
      await this.filingRepository.save(entity);
      await this.redis.sadd(SEC_FILING_URL_SET, url);
    }
  }
}
