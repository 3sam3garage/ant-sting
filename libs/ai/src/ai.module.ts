import { Module } from '@nestjs/common';
import { AppConfigModule } from '@libs/config';
import { GeminiService } from './service';

@Module({
  imports: [AppConfigModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class AiModule {}
