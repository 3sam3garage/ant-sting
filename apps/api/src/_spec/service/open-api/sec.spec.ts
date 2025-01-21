import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { parse as parseHTML } from 'node-html-parser';
import {
  DATA_SEC_GOV_HEADERS,
  SEC_FAIR_ACCESS_HEADERS,
} from '@libs/external-api/constants';

describe('SEC', () => {
  const formatCIK = (cik: string) => {
    const prefixCount = 10 - cik.length;
    const prefix = new Array(prefixCount).fill('0').join('');
    return `CIK${prefix}${cik}`;
  };

  // https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data
  describe('with fair access', () => {
    it('company-tickers.json', async () => {
      const res = await axios.get(
        'https://www.sec.gov/files/company_tickers.json',
        { headers: DATA_SEC_GOV_HEADERS },
      );

      console.log(res.data);
    });
  });

  describe('with data.sec.gov', () => {
    it('submission', async () => {
      const cik = '1506983';
      const submission = formatCIK(cik);

      const res = await axios.get(
        `https://data.sec.gov/submissions/${submission}.json`,
        { headers: DATA_SEC_GOV_HEADERS },
      );

      const urls = [];
      const { accessionNumber, primaryDocument, filingDate, form } =
        res?.data?.filings?.recent;
      for (let i = 0; i < accessionNumber.length; i++) {
        const formType = form[i];
        // if (formType !== '8-K') {
        //   continue;
        // }

        const accessNum = accessionNumber[i]?.replaceAll('-', '');
        const document = primaryDocument[i];
        const date = filingDate[i];
        const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessNum}/${document}`;

        urls.push({ date, url, formType });
      }

      console.log(1);
    });

    it('call report page', async () => {
      const res = await axios.get(
        'https://www.sec.gov/Archives/edgar/data/1816431/000114036125000295/ny20041128x2_8k.htm',
        { headers: SEC_FAIR_ACCESS_HEADERS },
      );

      const html = parseHTML(res.data)?.removeWhitespace();
      const body = html.querySelector('body');

      console.log(body.innerHTML);
      console.log(body.innerHTML);
    });

    it('rss', async () => {
      const res = await axios.get(
        'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=&company=&dateb=&owner=include&output=atom',
        {
          params: { start: 0, count: 100 },
          headers: SEC_FAIR_ACCESS_HEADERS,
        },
      );

      const json = await parseStringPromise(res.data, {
        trim: true,
        explicitArray: false,
        emptyTag: () => null,
      });
      console.log(json);
    });
  });

  describe('xbrl', () => {
    // 안쓸뜻
    it('company concept', async () => {
      const rawCIK = '320193';
      const cik = formatCIK(rawCIK);

      const res = await axios.get(
        `https://data.sec.gov/api/xbrl/companyconcept/${cik}/us-gaap/AccountsPayableCurrent.json`,
        { headers: DATA_SEC_GOV_HEADERS },
      );

      console.log(res);
    });

    it('company facts', async () => {
      const rawCIK = '320193';
      const cik = formatCIK(rawCIK);

      const res = await axios.get(
        `https://data.sec.gov/api/xbrl/companyfacts/${cik}.json`,
        { headers: DATA_SEC_GOV_HEADERS },
      );

      console.log(res);
    });

    // 안쓸뜻
    it('frames', async () => {
      const res = await axios.get(
        `https://data.sec.gov/api/xbrl/frames/us-gaap/AccountsPayableCurrent/USD/CY2019Q1I.json`,
        { headers: DATA_SEC_GOV_HEADERS },
      );

      console.log(res);
    });
  });
});
