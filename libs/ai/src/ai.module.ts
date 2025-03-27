import { Module } from '@nestjs/common';
import { AppConfigModule } from '@libs/config';
import { GeminiService, OllamaService } from './service';

@Module({
  imports: [AppConfigModule],
  providers: [OllamaService, GeminiService],
  exports: [OllamaService, GeminiService],
})
export class AiModule {}
