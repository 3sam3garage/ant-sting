import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';

@Module({
  imports: [
    InvestReportDomainModule,
    BullModule.registerQueueAsync({
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        return {
          name: QUEUE_NAME.INVEST_REPORT_SUMMARY,
          connection: config.getConfig(),
        };
      },
    }),
  ],
})
export class ScoreReportModule {}
