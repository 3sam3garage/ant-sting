import axios from 'axios';

describe('ollama', () => {
  it(
    'llama 3.1 api',
    async () => {
      const responses = [];

      for (let i = 0; i < 3; i++) {
        const res = await axios.post('http://localhost:11434/api/generate', {
          model: 'llama3.1',
          prompt: '',
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
          serviceKey: process.env.DATA_GO_SERVICE_KEY,
          idxNm: '코스피',
          resultType: 'json',
          numOfRows: 30,
        },
      },
    );

    console.log(res.data);
  });

  it('includes', async () => {
    const q = '2024-08-08'.replaceAll(/\-/g, '');
    console.log(q);
  });
});
