import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockMarketNewsDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { BrowserModule } from '@libs/browser';
import { StockMarketNewsConsumer } from './service';

@Module({
  imports: [
    EconomicInformationDomainModule,
    StockMarketNewsDomainModule,
    BrowserModule,
    AiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_MARKET_NEWS,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [StockMarketNewsConsumer],
})
export class NewsModule {}
