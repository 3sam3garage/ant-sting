import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { PACKAGE_ECONOMIC_INFORMATION_PROMPT } from '@libs/ai';
import { economicInformation } from '../constants';

describe('batch: economic-news', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  const client = new BedrockRuntimeClient({ region: 'us-east-1' });

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
  });

  it('packaged news', async () => {
    const query = PACKAGE_ECONOMIC_INFORMATION_PROMPT.replace(
      '{{INFORMATION}}',
      economicInformation.items.join('\n'),
    );

    // Prepare the payload for the model.
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      system: 'You are a veteran financial planner and analyst.',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: [{ type: 'text', text: query }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] },
      ],
    };

    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(payload),
      modelId,
    });
    const apiResponse = await client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);

    const json = JSON.parse('{' + responseBody.content[0].text);

    return json;
  });
});
