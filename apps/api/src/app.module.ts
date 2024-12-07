import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { RequestLoggerMiddleware } from './middlewares';
import { StockReportModule } from './stock-report';
import { StockAnalysisModule } from './stock-analysis';
import { EconomicInformationAnalysisModule } from './economic-information-analysis';

@Module({
  imports: [
    CoreModule,
    StockReportModule,
    StockAnalysisModule,
    EconomicInformationAnalysisModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
