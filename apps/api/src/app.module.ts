import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { ReportModule } from './report';
import { RequestLoggerMiddleware } from './middlewares';

@Module({
  imports: [CoreModule, ReportModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
