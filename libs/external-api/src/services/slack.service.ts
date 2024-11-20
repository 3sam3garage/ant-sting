import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';
import { WebClient } from '@slack/web-api';
import { SlackMessage } from '@libs/external-api/intefaces';

@Injectable()
export class SlackService {
  private readonly slackUrl: string;
  private readonly client;

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {
    this.slackUrl = externalApiConfigService.slackWebhookUrl;
    this.client = new WebClient(externalApiConfigService.slackToken);
  }

  async sendMessage(message: SlackMessage) {
    return await axios.post(this.slackUrl, message);
  }

  /**
   * 작업중. 권한관리가 잘 안됨.
   */
  async createCanvas() {
    // const result = await this.client.canvases.create({
    //   title: 'test canvas',
    //   document_content: { type: 'markdown', markdown: '> standalone canvas!' },
    // });
    // const accessResponse = await this.client.canvases.access.set({
    //   access_level: 'read',
    //   canvas_id: 'F081TMQBW9H',
    //   channel_ids: ['C081LFWTG2H'],
    //   user_ids: ['U03KW96TJU9'],
    // });
    //
    // return null;
  }
}
