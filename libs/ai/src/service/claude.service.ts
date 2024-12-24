import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { Injectable } from '@nestjs/common';
import { BASE_SYSTEM_PROMPT } from '../constants';

interface InvokeOptions {
  temperature?: number;
  system?: string;
  max_tokens?: number;
}

@Injectable()
export class ClaudeService {
  private modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient();
  }

  private async send(payload: string) {
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: payload,
      modelId: this.modelId,
    });
    const apiResponse = await this.client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    const json = JSON.parse('{' + responseBody.content[0].text);

    return json;
  }

  async invoke(
    prompt: string,
    options: InvokeOptions = {},
  ): Promise<Record<string, any>> {
    const {
      system = BASE_SYSTEM_PROMPT,
      temperature = 1,
      max_tokens = 5000,
    } = options;

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      system,
      temperature,
      max_tokens,
      messages: [
        { role: 'user', content: [{ type: 'text', text: prompt }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] },
      ],
    };

    return this.send(JSON.stringify(payload));
  }
}
