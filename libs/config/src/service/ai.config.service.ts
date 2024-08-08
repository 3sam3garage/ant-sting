import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import aiConfig from '../source/ai.config';

@Injectable()
export class AiConfigService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly config: ConfigType<typeof aiConfig>,
  ) {}

  get ollamaUrl(): string {
    return this.config.OLLAMA_URL;
  }
}
