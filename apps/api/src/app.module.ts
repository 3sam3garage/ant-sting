import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from '@libs/core';
import { ReportModule } from './report';
import { RequestLoggerMiddleware } from './middlewares';

@Module({
  imports: [CoreModule, ReportModule, ScheduleModule.forRoot()],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
