import { Module } from '@nestjs/common';
import { AppConfigModule } from '@libs/shared/config';
import { AI_TOKEN } from '@libs/application';
import { GeminiService } from './service';

@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: AI_TOKEN.GEMINI,
      useClass: GeminiService,
    },
  ],
  exports: [AI_TOKEN.GEMINI],
})
export class AiModule {}
