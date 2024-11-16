import axios from 'axios';
import { parse as parseToHTML } from 'node-html-parser';

describe('인베스팅스 닷컴', () => {
  it('analysis page call', async () => {
    const res = await axios.get(
      'https://kr.investing.com/analysis/most-popular-analysis',
    );

    const html = parseToHTML(res.data);
    const articles = html.querySelectorAll('#leftColumn article[data-id]');

    console.log(articles);
  });

  /**
   * https://api.investing.com/api/analysis/?page-size=15&sml-ids=283&page=1
   *
   */

  it('원자재 분석 목록', async () => {
    const res = await axios.get(
      'https://api.investing.com/api/analysis?page-size=15&sml-ids=283&page=1',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          Origin: 'https://kr.investing.com',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE3NzgxNjcsImp0aSI6IjAiLCJpYXQiOjE3MzE3NzQ1NjcsImlzcyI6ImludmVzdGluZy5jb20iLCJ1c2VyX2lkIjowLCJwcmltYXJ5X2RvbWFpbl9pZCI6IiIsIkF1dGhuU3lzdGVtVG9rZW4iOiIiLCJBdXRoblNlc3Npb25Ub2tlbiI6IiIsIkRldmljZVRva2VuIjoiIiwiVWFwaVRva2VuIjoiIiwiQXV0aG5JZCI6IiIsIklzRG91YmxlRW5jcnlwdGVkIjpmYWxzZSwiRGV2aWNlSWQiOiIiLCJSZWZyZXNoRXhwaXJlZEF0IjoxNzM0Mjk0NTY3fQ.D05T-OX_KTdhp1jo7dJ52I1NbAmqa4UPcRRUsS8nvkk',
        },
      },
    );

    console.log(res.data);
  });
});
