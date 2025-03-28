import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { StockReportModule } from './stock-report';
import { StockAnalysisModule } from './stock-analysis';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  HttpExceptionFilter,
  validationExceptionFilter,
  RequestLoggerMiddleware,
} from './components';

@Module({
  imports: [CoreModule, StockReportModule, StockAnalysisModule],
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
