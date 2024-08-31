import axios from 'axios';
import fs from 'node:fs';
import { parse as parseToHTML } from 'node-html-parser';
import unzipper from 'unzipper';
import iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';

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

  it('corporation financial statement api', async () => {
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

  it('corporation financial statement file', async () => {
    const res = await axios.get(
      'https://opendart.fss.or.kr/disclosureinfo/fnltt/dwld/list.do',
    );

    const html = parseToHTML(res.data);

    const fileNames = [];
    const anchors = html.querySelectorAll('tr td a');
    for (const anchor of anchors) {
      const onclick = anchor.getAttribute('onclick');

      const [match] = onclick.match(/([^']*\.zip)/);
      if (match) {
        fileNames.push(match);
      }
    }

    const basePath =
      'https://opendart.fss.or.kr/cmm/downloadFnlttZip.do?fl_nm=';
    for (const fileName of fileNames) {
      const path = `${basePath}${fileName}`;
      const res = await axios.get(path, {
        // responseType: 'arraybuffer',
      });
      const { files } = await unzipper.Open.buffer(res.data);
      const [file] = files;

      const content = await file.buffer();
      console.log(content.toString('utf-8'));
    }

    console.log(html);
  });

  it('download financial-statement file', async () => {
    const res = await axios.get(
      'https://opendart.fss.or.kr/cmm/downloadFnlttZip.do',
      {
        params: { fl_nm: '2024_1Q_BS_20240807030247.zip' },
        responseType: 'arraybuffer',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
      },
    );

    const { files } = await unzipper.Open.buffer(res.data);

    for (const file of files) {
      const content = await file.buffer();

      // const pathName = iconv.decode(file.pathBuffer, 'EUC-KR');
      // if (!pathName.includes('연결')) {
      //   console.log('연결');
      // }

      const text = iconv.decode(content, 'EUC-KR');

      const data = parse(text, {
        columns: true,
        delimiter: '\t',
        skipEmptyLines: true,
        trim: true,
        relaxColumnCount: true,
      });
      console.log(data);
    }
  });
});
