import { NestFactory } from '@nestjs/core';
import { AgentModule } from './agent.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AgentModule);

  app.enableShutdownHooks();
}
bootstrap();
