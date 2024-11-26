import { eucKR2utf8 } from '@libs/common';
import axios from 'axios';
import pdf from 'pdf-parse';
import { PDF_PARSING_PROMPT } from '../constants';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

describe('shinhan-crawler', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  let client: BedrockRuntimeClient;

  const file =
    'https://bbs2.shinhansec.com/board/message/file.do?attachmentId=330309';

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
    client = new BedrockRuntimeClient({ region: 'us-east-1' });
  });

  it('list', async () => {
    const response = await axios.get(
      'https://bbs2.shinhansec.com/mobile/json.list.do?boardName=foreignstock&curPage=1',
      { responseType: 'arraybuffer' },
    );

    const text = eucKR2utf8(response.data);
    const json = JSON.parse(text);
    console.log(json.list);
  });

  it('parsing', async () => {
    const response = await axios.get(
      'https://bbs2.shinhansec.com/mobile/json.list.do?boardName=foreignstock&curPage=1',
      { responseType: 'arraybuffer' },
    );

    const text = eucKR2utf8(response.data);
    const json = JSON.parse(text);

    const items = [];
    for (const item of json.list) {
      for (const [key, value] of Object.entries(item)) {
        const fieldName = json.title[key];
        item[fieldName] = value;
        delete item[key];
      }
      items.push(item);
    }

    console.log(items);
  });

  it.skip('detail page', async () => {
    const response = await axios.get(
      'https://bbs2.shinhansec.com/mobile/view.do?boardName=foreignstock&messageId=906169&messageNumber=2790',
      { responseType: 'arraybuffer' },
    );

    const text = eucKR2utf8(response.data);
    console.log(text);
  });

  it('pdf summary', async () => {
    const item = await axios.get(file, { responseType: 'arraybuffer' });
    const data = await pdf(item.data, { max: 2 });

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
