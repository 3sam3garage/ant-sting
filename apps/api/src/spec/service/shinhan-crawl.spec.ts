import { eucKR2utf8 } from '@libs/common';
import axios from 'axios';

describe('shinhan-crawler', () => {
  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
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

  it('detail', async () => {
    const response = await axios.get(
      'https://bbs2.shinhansec.com/mobile/view.do?boardName=foreignstock&messageId=906169&messageNumber=2790',
      { responseType: 'arraybuffer' },
    );

    const text = eucKR2utf8(response.data);
    console.log(text);
  });
});
