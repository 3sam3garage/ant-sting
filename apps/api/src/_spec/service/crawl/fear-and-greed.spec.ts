import axios from 'axios';

describe('FeatAndGreed', () => {
  it('api call', async () => {
    const fngIndex = await axios.get(
      'https://production.dataviz.cnn.io/index/fearandgreed/graphdata/2024-11-28',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      },
    );

    console.log(fngIndex.data);
  });
});
