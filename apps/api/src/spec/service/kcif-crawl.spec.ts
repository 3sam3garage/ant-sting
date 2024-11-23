import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';
import { joinUrl } from '@libs/common';
import { KCIF_RESEARCH_URL } from '@libs/domain';

describe('kcif-crawler', () => {
  const url = 'https://www.kcif.or.kr/annual/reportList';

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
  });

  // 매번 다른 응답이 돌아온다. puppeteer 써야할듯?
  it('list', async () => {
    const response = await axios.get(url);
    const html = parseToHTML(response.data);

    const rows = html.querySelectorAll(
      'div.page_list_wrap > ul.page_list > li',
    );

    for (const row of rows) {
      const titleAnchor = row.querySelector('a');
      const href = titleAnchor?.getAttribute('href');

      const url = joinUrl(KCIF_RESEARCH_URL, href);

      console.log(url);
    }

    console.log(1);
  });

  it('detail', async () => {
    const url =
      'https://www.kcif.or.kr/annual/reportView?rpt_no=35114&mn=001002&skey=&sval=&pg=1&pp=10';

    const response = await axios.get(url);
    const html = parseToHTML(response.data);

    const text = html.querySelector('div.cont_area').innerText;
    const content = text
      .replaceAll(/&middot;/g, '•')
      .replaceAll(/&amp;/g, '&')
      .replaceAll(/&nbsp;/g, ' ')
      .trim();

    console.log(content);
  });
});
