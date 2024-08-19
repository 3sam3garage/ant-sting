import axios from 'axios';
import { REPORT_SUMMARY, QUERY, POST_FIX } from '@libs/domain';

describe('ollama', () => {
  it(
    'llama 3.1 api',
    async () => {
      const responses = [];

      for (let i = 0; i < 3; i++) {
        const res = await axios.post('http://localhost:11434/api/generate', {
          model: 'llama3.1',
          prompt: `${REPORT_SUMMARY} \n\n ${QUERY} \n\n ${POST_FIX}`,
          stream: false,
        });

        responses.push(res.data.response);
      }

      console.log(responses);
    },
    120 * 1000,
  );

  it('kospi api', async () => {
    const res = await axios.get(
      'https://apis.data.go.kr/1160100/service/GetMarketIndexInfoService/getStockMarketIndex',
      {
        params: {
          serviceKey:
            'zP1AqGVnekq2IFOq1nhqEmV8KOZZqVPKTIipBVW6h/G3lOI8HnoCX2QYbxVYJi2qHGl6SrfZqmHMlS7yAHLF4A==',
          idxNm: '코스피',
          resultType: 'json',
          numOfRows: 30,
        },
      },
    );

    console.log(res.data);
  });
});
