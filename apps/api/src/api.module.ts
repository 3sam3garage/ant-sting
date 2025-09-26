import { Module, ValidationPipe } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CoreModule } from '@libs/shared/core';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './components/interceptor/http-exception.filter';
import { validationExceptionFilter } from './components/interceptor/validation-exception.filter';
import { LoggingInterceptor } from './components/interceptor/request-logger.interceptor';

@Module({
  imports: [CoreModule, PortfolioModule],
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
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class ApiModule {}
