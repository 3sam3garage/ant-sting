import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { StockReportModule } from './stock-report';
import { StockAnalysisModule } from './stock-analysis';
import { EconomicInformationAnalysisModule } from './economic-information-analysis';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  HttpExceptionFilter,
  validationExceptionFilter,
  RequestLoggerMiddleware,
} from './components';
import { ExchangeRateModule } from './exchange-rate';
import { BondYieldModule } from './bond-yield';
import { FilingModule } from './filing';
import { TickerModule } from './ticker';
import { ShortInterestModule } from './short-interest';
import { StockIndexModule } from './stock-index';
import { InterestRateModule } from './interest-rate';

@Module({
  imports: [
    CoreModule,
    StockReportModule,
    StockAnalysisModule,
    ExchangeRateModule,
    BondYieldModule,
    FilingModule,
    TickerModule,
    StockIndexModule,
    ShortInterestModule,
    InterestRateModule,
    EconomicInformationAnalysisModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          exceptionFactory: validationExceptionFilter,
          whitelist: true,
          transform: true,
          transformOptions: {
            ignoreDecorators: true,
          },
        });
      },
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
