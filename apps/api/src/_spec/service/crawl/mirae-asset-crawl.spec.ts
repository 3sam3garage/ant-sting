import { requestAndParseEucKr } from '@libs/common';

describe('mirae-asset-crawler', () => {
  const url =
    'https://securities.miraeasset.com/bbs/board/message/list.do?categoryId=1800&selectedId=1531&searchType=2&searchText=&searchStartYear=2023&searchStartMonth=11&searchStartDay=24&searchEndYear=2024&searchEndMonth=11&searchEndDay=23';

  beforeEach(() => {
    process.env.AWS_PROFILE = 'dev';
    process.env.AWS_PROFILEAWS_SDK_LOAD_CONFIG = '1';
  });

  // 매번 다른 응답이 돌아온다. puppeteer 써야할듯?
  it('list', async () => {
    const html = await requestAndParseEucKr(url);
    const tables = html.querySelectorAll('table').map((item) => item.innerHTML);
    const rows = html
      .querySelectorAll('table tr')
      .map((item) => item.innerHTML);

    console.log(tables, rows);
  });
});
