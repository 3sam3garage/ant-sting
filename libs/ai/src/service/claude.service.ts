import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaudeService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient();
  }

  async invoke(query: string) {
    const input = {
      inputText: query,
      textGenerationConfig: {
        maxTokenCount: 4096,
        stopSequences: [],
        temperature: 0,
        topP: 1,
      },
    };

    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(input),
      modelId: '"anthropic.claude-3-haiku-20240307-v1:0"',
    });

    const apiResponse = await this.client.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.content[0].text;
  }
}
