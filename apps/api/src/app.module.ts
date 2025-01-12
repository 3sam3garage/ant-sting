import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { RequestLoggerMiddleware } from './components/middlewares';
import { StockReportModule } from './stock-report';
import { StockAnalysisModule } from './stock-analysis';
import { EconomicInformationAnalysisModule } from './economic-information-analysis';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './components';
import { ExchangeRateModule } from './exchange-rate';
import { BondYieldModule } from './bond-yield';
import { FilingModule } from './filing';

@Module({
  imports: [
    CoreModule,
    StockReportModule,
    StockAnalysisModule,
    ExchangeRateModule,
    BondYieldModule,
    FilingModule,
    EconomicInformationAnalysisModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
