import { Module } from '@nestjs/common';
import {
  FinancialStatementDomainModule,
  ForeignStockReportDomainModule,
  StockAnalysisDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { AiModule } from '@libs/ai';
import { ExternalApiModule } from '@libs/external-api';
import { AnalyzeHanaStockConsumer, AnalyzeStockConsumer } from './service';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME, RedisConfigService } from '@libs/config';

@Module({
  imports: [
    StockAnalysisDomainModule,
    ForeignStockReportDomainModule,
    FinancialStatementDomainModule,
    StockReportDomainModule,
    AiModule,
    ExternalApiModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK_PDF,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME.ANALYZE_STOCK,
      inject: [RedisConfigService],
      useFactory: async (config: RedisConfigService) => {
        return { redis: config.getConfig() };
      },
    }),
  ],
  providers: [AnalyzeStockConsumer, AnalyzeHanaStockConsumer],
})
export class AnalyzeStockModule {}
