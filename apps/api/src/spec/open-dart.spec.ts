import axios from 'axios';
import fs from 'node:fs';

describe('open-dart', () => {
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

  it('corporation info', async () => {
    const res = await axios.get('https://opendart.fss.or.kr/api/corpCode.xml', {
      params: { crtfc_key: process.env.OPEN_DART_API_KEY },
      responseType: 'arraybuffer',
    });

    fs.writeFileSync('./tmp/corpCode.xml', res.data);
  });

  it('corporation info', async () => {
    const res = await axios.get(
      'https://opendart.fss.or.kr/api/fnlttSinglIndx.json',
      {
        params: {
          crtfc_key: '',
          corp_code: '00164742',
          bsns_year: '2022',
          reprt_code: '11014',
          idx_cl_code: 'M230000',
        },
      },
    );

    const data = (res.data.list || []).reduce(
      (acc, cur) => {
        acc[cur.idx_nm] = +cur?.idx_val || null;
        return acc;
      },
      {} as Record<string, number | null>,
    );

    console.log(data);
  });
});
