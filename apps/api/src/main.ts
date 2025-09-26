import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { CommonConfigService } from '@libs/shared/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  const configService = app.get(CommonConfigService);

  const { port } = configService;
  await app.listen(port, () => {
    Logger.log(`listening:${port}`);
  });
}
bootstrap();
