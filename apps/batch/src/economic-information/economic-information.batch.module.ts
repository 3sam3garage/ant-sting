import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  BondYieldDomainModule,
  EconomicInformationDomainModule,
  ExchangeRateDomainModule,
  InterestRateDomainModule,
  StockIndexDomainModule,
} from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { EconomicInformationCommand } from './commands';
import {
  NaverEconomicInformationCrawler,
  AnalyzeEconomicInformationTask,
  KcifEconomicInformationCrawler,
  ExchangeRateFetcher,
  BondYieldFetcher,
  InterestRateFetcher,
  StockIndexFetcher,
} from './tasks';
import { ExternalApiModule } from '@libs/external-api';

@Module({
  imports: [
    AiModule,
    ExternalApiModule,
    EconomicInformationDomainModule,
    ExchangeRateDomainModule,
    BondYieldDomainModule,
    InterestRateDomainModule,
    StockIndexDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ECONOMIC_INFORMATION,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getCommonConfig() };
      },
    }),
  ],
  providers: [
    EconomicInformationCommand,
    NaverEconomicInformationCrawler,
    AnalyzeEconomicInformationTask,
    KcifEconomicInformationCrawler,
    ExchangeRateFetcher,
    BondYieldFetcher,
    InterestRateFetcher,
    StockIndexFetcher,
  ],
})
export class EconomicInformationBatchModule {}
