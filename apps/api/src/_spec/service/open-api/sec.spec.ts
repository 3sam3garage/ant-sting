import axios from 'axios';

describe('SEC', () => {
  describe('with fair access', () => {
    // https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data
    const DEFAULT_HEADERS = {
      Host: 'www.sec.gov',
      'User-Agent': 'Personal iamdap91@<naver>.com',
      'Accept-Encoding': 'gzip, deflate',
    };

    it('company-tickers.json', async () => {
      const res = await axios.get(
        'https://www.sec.gov/files/company_tickers.json',
        { headers: DEFAULT_HEADERS },
      );

      console.log(res.data);
    });
  });

  describe('with data.sec.gov', () => {
    const DEFAULT_HEADERS = {
      Host: 'data.sec.gov',
      'User-Agent': 'Personal iamdap91@<naver>.com',
      'Accept-Encoding': 'gzip, deflate',
    };

    it('reports', async () => {
      const formatCIK = (cik: string) => {
        const prefixCount = 10 - cik.length;
        const prefix = new Array(prefixCount).fill('0').join('');
        return `CIK${prefix}${cik}`;
      };

      const cik = '1506983';
      const submission = formatCIK(cik);

      const res = await axios.get(
        `https://data.sec.gov/submissions/${submission}.json`,
        { headers: DEFAULT_HEADERS },
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
      const res = await axios
        .get(
          'https://www.sec.gov/Archives/edgar/data/1816431/000114036125000295/ny20041128x2_8k.htm',
          { headers: { ...DEFAULT_HEADERS, Host: 'www.sec.gov' } },
        )
        .then((r) => {
          console.log(r);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  });
});
