import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/shared/config';
import { SlackApiImpl } from '@libs/application';
import { SlackMessage } from '@libs/domain/slack';

@Injectable()
export class SlackApi implements SlackApiImpl {
  private readonly slackUrl: string;

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {
    this.slackUrl = externalApiConfigService.slackWebhookUrl;
  }

  async sendMessage(message: SlackMessage) {
    return await axios.post(this.slackUrl, message);
  }
}
