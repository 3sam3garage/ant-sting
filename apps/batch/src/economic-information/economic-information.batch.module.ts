import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  BondYieldDomainModule,
  EconomicInformationDomainModule,
  ExchangeRateDomainModule,
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
} from './tasks';
import { ExternalApiModule } from '@libs/external-api';

@Module({
  imports: [
    AiModule,
    ExternalApiModule,
    EconomicInformationDomainModule,
    ExchangeRateDomainModule,
    BondYieldDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ECONOMIC_INFORMATION,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
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
  ],
})
export class EconomicInformationBatchModule {}
