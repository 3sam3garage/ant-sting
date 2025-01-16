import { Module } from '@nestjs/common';
import {
  FilingDomainModule,
  ShortInterestDomainModule,
  TickerDomainModule,
} from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';
import { SecTickerFetcher, FinraShortInterestScraper } from './tasks';
import { StockCommand } from './commands';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { REDIS_NAME } from '@libs/config';

@Module({
  imports: [
    TickerDomainModule,
    FilingDomainModule,
    ShortInterestDomainModule,
    ExternalApiModule,
  ],
  providers: [
    StockCommand,
    SecTickerFetcher,
    FinraShortInterestScraper,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class StockBatchModule {}
