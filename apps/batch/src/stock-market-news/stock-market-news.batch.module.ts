import { Module } from '@nestjs/common';
import { StockMarketNewsDomainModule } from '@libs/domain';
import { StockMarketNewsListScraper } from './tasks';
import { StockMarketNewsCommand } from './commands';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { QUEUE_NAME, REDIS_NAME, RedisConfigService } from '@libs/config';
import { BullModule } from '@nestjs/bull';
import { BrowserModule } from '@libs/browser';

@Module({
  imports: [
    StockMarketNewsDomainModule,
    BrowserModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_MARKET_NEWS,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [
    StockMarketNewsCommand,
    StockMarketNewsListScraper,
    {
      provide: REDIS_NAME.ANT_STING,
      inject: [RedisService],
      useFactory: (service: RedisService) => {
        return service.getOrThrow(REDIS_NAME.ANT_STING);
      },
    },
  ],
})
export class StockMarketNewsBatchModule {}
