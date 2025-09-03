import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EconomicInformationMongoModule } from '@libs/infrastructure/mongo';
import { QUEUE_NAME, RedisConfigService } from '@libs/shared/config';
import { AiModule } from '@libs/infrastructure/ai';
import { EconomicInformationCommand } from './commands';
import {
  NaverEconomicInformationCrawler,
  AnalyzeEconomicInformationTask,
  KcifEconomicInformationCrawler,
} from './tasks';
import { ExternalApiModule } from '@libs/infrastructure/external-api';

@Module({
  imports: [
    AiModule,
    ExternalApiModule,
    EconomicInformationMongoModule,
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
