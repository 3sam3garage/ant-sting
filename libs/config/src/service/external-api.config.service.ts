import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import externalApiConfig from '../source/external-api-config';

@Injectable()
export class ExternalApiConfigService {
  constructor(
    @Inject(externalApiConfig.KEY)
    private readonly config: ConfigType<typeof externalApiConfig>,
  ) {}

  get ollamaUrl(): string {
    return this.config.OLLAMA_URL;
  }

  get dataGoServiceKey(): string {
    return this.config.DATA_GO_SERVICE_KEY;
  }
}
