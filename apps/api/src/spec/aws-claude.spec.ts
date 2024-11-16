import {
  BedrockRuntimeClient,
  ConverseCommand,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
  BedrockClient,
  ListFoundationModelsCommand,
} from '@aws-sdk/client-bedrock';
import {
  PACKAGE_ECONOMIC_INFORMATION_PROMPT,
  RECOMMEND_PORTFOLIO_PROMPT,
} from '@libs/ai';
import { macroEnvironment } from './constants';

describe('aws claude', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  let client: BedrockRuntimeClient;
  let bedrockClient: BedrockClient;

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';

    client = new BedrockRuntimeClient({ region: 'us-east-1' });
    bedrockClient = new BedrockClient();
  });

  describe('native features', () => {
    it('get foundation model list', async () => {
      const command = new ListFoundationModelsCommand({});
      const res = await bedrockClient.send(command);

      const models = res?.modelSummaries || [];

      for (const model of models) {
        console.log(model.modelArn);
      }

      console.log(1);
    });

    it('converse request', async () => {
      const query =
        'describe most important feature in korea stock market. answer in korean';
      const conversation = [
        { role: 'user', content: [{ text: query }] },
      ] as never;

      // Create a command with the model ID, the message, and a basic configuration.
      const command = new ConverseCommand({
        modelId,
        messages: conversation,
        inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
      });

      const res = await client.send(command);
      const contents = res.output.message.content;

      console.log(contents);
    });

    it('invoke request', async () => {
      const query =
        'describe most important feature in korea stock market. answer in korean. answer in json format. feature field is required.';
      const client = new BedrockRuntimeClient({ region: 'us-east-1' });

      // Prepare the payload for the model.
      const payload = {
        anthropic_version: 'bedrock-2023-05-31',
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
        modelId,
      });
      const apiResponse = await client.send(command);

      const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
      const responseBody = JSON.parse(decodedResponseBody);

      const json = JSON.parse('{' + responseBody.content[0].text);

      return json;
    });
  });

  describe('service', () => {
    it('keyword extraction', async () => {
      const query = PACKAGE_ECONOMIC_INFORMATION_PROMPT.replace(
        '{{INFORMATION}}',
        `
        <market-info>${macroEnvironment.marketInfo.summaries}</market-info>
        <invest>${macroEnvironment.invest.summaries}</invest>
        <economy>${macroEnvironment.economy.summaries}</economy>
        <debenture>${macroEnvironment.debenture.summaries}</debenture>
      `,
      );
      const client = new BedrockRuntimeClient({ region: 'us-east-1' });

      // Prepare the payload for the model.
      const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        system: 'You are a veteran financial planner and analyst.',
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
        modelId,
      });
      const apiResponse = await client.send(command);

      const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
      const responseBody = JSON.parse(decodedResponseBody);

      const json = JSON.parse('{' + responseBody.content[0].text);

      return json;
    });

    it('recommend portfolio', async () => {
      const { debenture, economy, marketInfo, invest } = macroEnvironment;

      const query = RECOMMEND_PORTFOLIO_PROMPT.replace(
        '{{DEBENTURE}}',
        debenture.summaries.join('\n'),
      )
        .replace('{{ECONOMY}}', economy.summaries.join('\n'))
        .replace('{{INVEST}}', invest.summaries.join('\n'))
        .replace('{{MARKET_INFO}}', marketInfo.summaries.join('\n'));

      const client = new BedrockRuntimeClient({ region: 'us-east-1' });

      // Prepare the payload for the model.
      const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        system: 'You are a veteran financial planner and analyst.',
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
        modelId,
      });
      const apiResponse = await client.send(command);

      const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
      const responseBody = JSON.parse(decodedResponseBody);

      const json = JSON.parse('{' + responseBody.content[0].text);

      return json;
    });
  });
});
