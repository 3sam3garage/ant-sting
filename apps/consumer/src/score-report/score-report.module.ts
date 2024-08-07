import { Module } from '@nestjs/common';
import {
  InvestReportDomainModule,
  MarketInfoReportDomainModule,
} from '@libs/domain';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';
import { InvestReportConsumer, MarketInfoReportConsumer } from './service';

@Module({
  imports: [
    InvestReportDomainModule,
    MarketInfoReportDomainModule,
    BullModule.registerQueueAsync(
      {
        name: QUEUE_NAME.INVEST_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
      {
        name: QUEUE_NAME.MARKET_INFO_REPORT_SCORE,
        inject: [RedisConfigService],
        useFactory: (config: RedisConfigService) => {
          return { redis: config.getConfig() };
        },
      },
    ),
  ],
  providers: [InvestReportConsumer, MarketInfoReportConsumer],
})
export class ScoreReportModule {}
