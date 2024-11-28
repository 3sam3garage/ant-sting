import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { RequestLoggerMiddleware } from './middlewares';
import { StockReportModule } from './stock-report';
import { StockAnalysisModule } from './stock-analysis';

@Module({
  imports: [CoreModule, StockReportModule, StockAnalysisModule],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
