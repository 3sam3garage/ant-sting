import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { InvestReportConsumer } from './service';

@Module({
  imports: [
    InvestReportDomainModule,
    BullModule.registerQueueAsync({
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        return {
          name: QUEUE_NAME.INVEST_REPORT_SCORE,
          connection: config.getConfig(),
        };
      },
    }),
  ],
  providers: [InvestReportConsumer],
})
export class ScoreReportModule {}
