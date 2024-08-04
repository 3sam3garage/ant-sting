import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { InvestReportConsumer } from './service';

@Module({
  imports: [
    InvestReportDomainModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.INVEST_REPORT_SCORE,
      inject: [RedisConfigService],
      useFactory: (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [InvestReportConsumer],
})
export class ScoreReportModule {}
