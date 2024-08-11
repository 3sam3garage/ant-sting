import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CommonConfigService } from '@libs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(CommonConfigService);
  const port = configService.port;

  app.setGlobalPrefix('api');

  await app.listen(port || 3001);

  Logger.log(`Server on http://localhost:${port}`);
}
bootstrap();
