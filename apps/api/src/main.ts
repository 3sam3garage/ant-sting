import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonConfigService } from '@libs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(CommonConfigService);
  const port = configService.port;

  app.setGlobalPrefix('api');

  if (!configService.isProduction) {
    const config = new DocumentBuilder().setTitle('Ant-sting').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    Logger.log(`Swagger on http://localhost:${port}/docs`);
  }

  await app.listen(port || 3001);

  Logger.log(`Server on http://localhost:${port}`);
  if (!configService.isProduction) {
    Logger.log(`Swagger on http://localhost:${port}/docs`);
  }
}
bootstrap();
