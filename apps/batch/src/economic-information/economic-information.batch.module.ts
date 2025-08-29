import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EconomicInformationDomainModule } from '@libs/mongo';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { EconomicInformationCommand } from './commands';
import {
  NaverEconomicInformationCrawler,
  AnalyzeEconomicInformationTask,
  KcifEconomicInformationCrawler,
} from './tasks';
import { ExternalApiModule } from '@libs/external-api';

@Module({
  imports: [
    AiModule,
    ExternalApiModule,
    EconomicInformationDomainModule,
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
  ],
})
export class EconomicInformationBatchModule {}
