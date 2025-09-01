import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';
import { SlackMessage } from '../interfaces';

@Injectable()
export class SlackApi {
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
