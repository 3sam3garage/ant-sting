import { Module } from '@nestjs/common';
import { AppConfigModule } from '@libs/config';
import { OllamaService } from './service';

@Module({
  imports: [AppConfigModule],
  providers: [OllamaService],
  exports: [OllamaService],
})
export class AiModule {}
