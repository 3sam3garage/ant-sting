import { requestAndParseEucKr } from '@libs/common';

describe('economic-information', () => {
  const scrapeNaver = async (url: string): Promise<string> => {
    const html = await requestAndParseEucKr(url);
    const content = html
      .querySelectorAll('.view_cnt p')
      .map((item) => item?.innerText?.trim())
      .join('\n');

    return content;
  };

  it('scrape', async () => {
    const res = await scrapeNaver(
      'https://finance.naver.com/research/invest_read.naver?nid=34728&page=1',
    );

    console.log(res);
  });
});
