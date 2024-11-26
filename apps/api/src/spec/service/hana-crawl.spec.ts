import axios from 'axios';
import pdf from 'pdf-parse';
import { parse as parseHTML } from 'node-html-parser';
import { formatEightDigitDate, joinUrl } from '@libs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { PDF_PARSING_PROMPT } from '../constants';

const summary = {
  title: '도쿄일렉트론 (8035 JP): 가이던스 상향에도 부진한 주가 흐름 지속',
  href: 'https://www.hanaw.com/main/research/research/download.cmd?bbsSeq=1280907&attachFileSeq=1&bbsId=&dbType=&bbsCd=4003',
};

it('figuring market', () => {
  const regex = new RegExp(/\(.+\.\w{2}\)/);

  const [marketInfo, ...rest] =
    '시세이도(4911.JP): 3Q24 Review: 컨센서스 하회, 가이던스 하향'.split(':');
  const title = rest.join(':');

  const [match] = marketInfo?.match(regex);
  const [code, market] = match?.replace('(', '')?.replace(')', '').split('.');
  console.log(code, market);
  console.log(title?.trim());
  console.log(marketInfo);

  const stockName = marketInfo.replace(regex, '')?.trim();
  console.log(stockName);
});

describe('hana-crawler', () => {
  const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
  let client: BedrockRuntimeClient;
  const HANA_BASE_URL = 'https://www.hanaw.com';

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
    client = new BedrockRuntimeClient({ region: 'us-east-1' });
  });

  it('list', async () => {
    const response = await axios.get(
      'https://www.hanaw.com/main/research/research/list.cmd?pid=8&cid=3',
      { responseType: 'json' },
    );

    const html = parseHTML(response.data);

    const rows = html.querySelectorAll(
      '#container div.daily_bbs > ul > li > div.con',
    );

    const items = [];
    for (const row of rows) {
      const titleAnchor = row.querySelector('a.more_btn');
      const title = titleAnchor?.innerText?.trim();
      const fileAnchor = row.querySelector('a.j_fileLink');
      const href = fileAnchor?.getAttribute('href');
      const dateAnchor = row.querySelector('span.txtbasic');
      const date = formatEightDigitDate(dateAnchor.innerText);

      items.push({ title, href: joinUrl(HANA_BASE_URL, href, date) });
    }

    console.log(items);
  });

  it('pdf summary', async () => {
    const item = await axios.get(summary.href, { responseType: 'arraybuffer' });
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
