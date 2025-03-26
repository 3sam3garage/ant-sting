import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { Injectable } from '@nestjs/common';
import { BASE_SYSTEM_PROMPT } from '../constants';

export enum MODEL_TYPE {
  CLAUDE_SONNET = 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  CLAUDE_HAIKU = 'anthropic.claude-3-haiku-20240307-v1:0',
}

interface InvokeOptions {
  temperature?: number;
  system?: string;
  max_tokens?: number;
  model?: MODEL_TYPE;
}

interface InvokePayload {
  payload: string;
  model: MODEL_TYPE;
}

/**
 * @deprecated
 */
@Injectable()
export class ClaudeService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient();
  }

  private async sendInJson({ payload, model }: InvokePayload) {
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: payload,
      modelId: model,
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
      max_tokens = 200000,
      model = MODEL_TYPE.CLAUDE_SONNET,
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

    return this.sendInJson({
      payload: JSON.stringify(payload),
      model,
    });
  }
}
