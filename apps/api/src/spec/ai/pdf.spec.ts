import fs from 'node:fs';
import pdf from 'pdf-parse';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { PDF_PARSING_PROMPT } from '../constants';

describe('pdf', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  let client: BedrockRuntimeClient;

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';

    client = new BedrockRuntimeClient({ region: 'us-east-1' });
  });

  it('read pdf', async () => {
    const dataBuffer = fs.readFileSync('./tmp/wmt.pdf');
    const data = await pdf(dataBuffer, { max: 1 });
    const query = PDF_PARSING_PROMPT.replace(
      '{{PDF_EXTRACTED_TEXT}}',
      data.text,
    );

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: [{ type: 'text', text: query }] },
        { role: 'assistant', content: [{ type: 'text', text: '{' }] },
      ],
    };

    const command = new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(payload),
      modelId,
    });

    const apiResponse = await client.send(command);

    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);

    const json = JSON.parse('{' + responseBody.content[0].text);

    console.log(json);
    return json;
  });
});
