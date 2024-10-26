import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaudeService {
  private modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient();
  }

  async invoke(query: string) {
    const payload = {
      // anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: [{ type: 'text', text: query }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] },
      ],
    };

    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(payload),
      modelId: this.modelId,
    });
    const apiResponse = await this.client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody?.content?.[0]?.text;
  }
}
