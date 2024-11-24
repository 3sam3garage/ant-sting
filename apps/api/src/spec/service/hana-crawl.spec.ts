import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';
import { joinUrl } from '@libs/common';

describe('hana-crawler', () => {
  const HANA_BASE_URL = 'https://www.hanaw.com';

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
  });

  it('list', async () => {
    const response = await axios.get(
      'https://www.hanaw.com/main/research/research/RC_000000_M.cmd',
      { responseType: 'json' },
    );

    const html = parseHTML(response.data);

    const items = html.querySelectorAll(
      '#container div.rc_main-list > div.box dl',
    );
    for (const item of items) {
      const titleAnchor = item.querySelector('dt > a');
      const title = titleAnchor?.innerText?.trim();
      const href = titleAnchor?.getAttribute('href');

      console.log(title);
      console.log(joinUrl(HANA_BASE_URL, href));
    }
  });
});
