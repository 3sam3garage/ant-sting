import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const DEFAULT_ERROR_MESSAGE =
  '알 수 없는 에러가 발생했습니다. 서버 관리자에게 문의하세요.';

/** 모든 에러에 대한 exception filter */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new ConsoleLogger('HttpExceptionFilter');

  constructor() {}
  /**
   * 앱 전역 ExceptionFilter 메서드
   * @param exception - 에러
   * @param host - 컨텍스트
   */
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;

    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const name = isHttpException ? exception.name : 'InternalServerError';

    const message = isHttpException
      ? exception.message
      : `${DEFAULT_ERROR_MESSAGE} (${exception.message})`;

    const responsePayload = {
      msg: 'failure',
      data: {
        statusCode,
        name,
        message,
        stack: exception.stack,
      },
    };

    this.logger.error(responsePayload);

    response.status(statusCode).json(responsePayload);
  }
}
