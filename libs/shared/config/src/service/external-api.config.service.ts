import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import externalApiConfig from '../source/external-api-config';

@Injectable()
export class ExternalApiConfigService {
  constructor(
    @Inject(externalApiConfig.KEY)
    private readonly config: ConfigType<typeof externalApiConfig>,
  ) {}

  get slackWebhookUrl(): string {
    return this.config.SLACK_WEBHOOK_URL;
  }

  get slackToken(): string {
    return this.config.SLACK_TOKEN;
  }

  get googleAIStudioApiKey(): string {
    return this.config.GOOGLE_AI_STUDIO_API_KEY;
  }
}
