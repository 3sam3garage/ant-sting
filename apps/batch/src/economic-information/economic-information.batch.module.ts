import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EconomicInformationDomainModule } from '@libs/domain';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { AiModule } from '@libs/ai';
import { EconomicInformationCommand } from './commands';
import {
  ScrapeEconomicInformationCrawler,
  PackageEconomicInformationTask,
} from './tasks';

@Module({
  imports: [
    AiModule,
    EconomicInformationDomainModule,
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
    ScrapeEconomicInformationCrawler,
    PackageEconomicInformationTask,
  ],
})
export class EconomicInformationBatchModule {}
