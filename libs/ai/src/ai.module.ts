import { Module } from '@nestjs/common';
import { AppConfigModule } from '@libs/config';
import { ClaudeService, OllamaService } from './service';

@Module({
  imports: [AppConfigModule],
  providers: [OllamaService, ClaudeService],
  exports: [OllamaService, ClaudeService],
})
export class AiModule {}
