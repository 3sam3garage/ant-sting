import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ConsumerModule);
  await app.listen();
}
bootstrap();
