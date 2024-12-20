import { eucKR2utf8 } from '@libs/common';
import axios from 'axios';
import pdf from 'pdf-parse';
import { PDF_PARSING_PROMPT } from '../../constants';
import { ClaudeService } from '@libs/ai';
import { Test, TestingModule } from '@nestjs/testing';

describe('shinhan-crawler', () => {
  let claudeService: ClaudeService;
  const file =
    'https://bbs2.shinhansec.com/board/message/file.do?attachmentId=330309';

  beforeAll(async () => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaudeService],
    }).compile();

    claudeService = module.get(ClaudeService);
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

    await claudeService.invoke(query);
  });

  it('parsing stockName, ticker, market', () => {
    const text = 'Crowdstrike(CRWD.US)';

    const [match] = text.match(/\(.+(\.|\s)\w{2}\)/);
    const stockName = text.replace(/\(.+(\.|\s)\w{2}\)/, '');
    const [code, market] = match.replaceAll(/\(|\)/g, '').split(/\.|\s/);

    console.log(stockName, code, market);
  });
});
