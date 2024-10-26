import {
  BedrockRuntimeClient,
  ConverseCommand,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
  BedrockClient,
  ListFoundationModelsCommand,
} from '@aws-sdk/client-bedrock';

describe('aws claude', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  let client: BedrockRuntimeClient;
  let bedrockClient: BedrockClient;

  beforeEach(() => {
    client = new BedrockRuntimeClient({ region: 'us-east-1' });
    bedrockClient = new BedrockClient();
  });

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
    return responseBody.content[0].text;
  });
});
