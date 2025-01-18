import axios from 'axios';
import { groupBy } from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, ExternalApiConfigService } from '@libs/config';

describe('korea-bank', () => {
  let moduleRef: TestingModule;
  let apiKey: string;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [ExternalApiConfigService],
    }).compile();

    const externalConfigService = moduleRef.get(ExternalApiConfigService);

    apiKey = externalConfigService.ecosApiKey;
  });

  // exchange-rate
  describe('환율', () => {
    const serviceType = 'StatisticSearch';
    const code = '731Y001';
    const interval = 'D';
    const startDate = '20200101';
    const endDate = '20250301';
    const skip = 0;
    const limit = 10000;

    it('원/달러 환율', async () => {
      const subCode = '0000001';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    describe('달러 기준', () => {
      const code = '731Y002';

      it('원/일본엔 환율', async () => {
        const subCode = '0000002';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });

      it('원/유로 환율', async () => {
        const subCode = '0000003';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });
    });
  });

  // bond-yield
  it('주요국제 장단기 금리', async () => {
    const serviceType = 'StatisticSearch';
    const code = '902Y023';
    const interval = 'M';
    const startDate = '202401';
    const endDate = '202401';
    const skip = 0;
    const limit = 100;
    const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}`;

    const res = await axios.get(url);
    const { row, list_total_count } = res?.data?.[serviceType];

    console.log(row, list_total_count);

    const group = groupBy(row, 'ITEM_CODE2');
    console.log(group);
  });

  describe('기준금리', () => {
    const serviceType = 'StatisticSearch';
    const code = '722Y001';
    const interval = 'M';
    const startDate = '202301';
    const endDate = '202412';
    const skip = 0;
    const limit = 100;

    it('한국', async () => {
      const subCode = '0101000'; // 한국은행 기준금리
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);

      const group = groupBy(row, 'ITEM_CODE2');
      console.log(group);
    });
  });

  describe('정책금리', () => {
    const serviceType = 'StatisticSearch';
    const code = '902Y006';
    const interval = 'M';
    const startDate = '202301';
    const endDate = '202412';
    const skip = 0;
    const limit = 100;

    it('한국', async () => {
      const subCode = 'KR'; // 한국 ( US, JP, CN )
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('미국', async () => {
      const subCode = 'US'; // 한국 ( US, JP, CN )
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('일본', async () => {
      const subCode = 'JP'; // 한국 ( US, JP, CN )
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('중국', async () => {
      const subCode = 'CN'; // 한국 ( US, JP, CN )
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });
  });

  it('국고채 10년', async () => {
    const serviceType = 'StatisticSearch';
    const code = '721Y001';
    const subCode = '5050000'; // 국고채 10년
    const interval = 'M';
    const startDate = '202201';
    const endDate = '202401';
    const skip = 0;
    const limit = 100;
    const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

    const res = await axios.get(url);
    const { row, list_total_count } = res?.data?.[serviceType];

    console.log(row, list_total_count);
  });

  describe('실업률', () => {
    const serviceType = 'StatisticSearch';
    const interval = 'M';
    const startDate = '202201';
    const endDate = '202412';
    const skip = 0;
    const limit = 100;

    it('한국 실업률', async () => {
      const code = '902Y021';
      const subCode = 'KOR';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('미국 실업률', async () => {
      const code = '902Y021';
      const subCode = 'USA';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('일본 실업률', async () => {
      const code = '902Y021';
      const subCode = 'JPN';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });
  });

  describe('주요국 주가지수', () => {
    const serviceType = 'StatisticSearch';
    const interval = 'M';
    const startDate = '202201';
    const endDate = '202412';
    const skip = 0;
    const limit = 100;

    it('한국 주가지수', async () => {
      const code = '902Y002';
      const subCode = 'KOR';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('미국 주가지수', async () => {
      const code = '902Y002';
      const subCode = 'USA';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });

    it('일본 주가지수', async () => {
      const code = '902Y002';
      const subCode = 'JPN';
      const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

      const res = await axios.get(url);
      const { row, list_total_count } = res?.data?.[serviceType];

      console.log(row, list_total_count);
    });
  });

  describe('주요국 경제성장률', () => {
    describe('분기', () => {
      const serviceType = 'StatisticSearch';
      const code = '902Y015';
      const interval = 'Q';
      const startDate = '2022Q1';
      const endDate = '2024Q1';
      const skip = 0;
      const limit = 100;

      it('한국 경제성장률', async () => {
        const subCode = 'KOR';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });

      it('미국 경제성장률', async () => {
        const subCode = 'USA';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });

      it('일본 경제성장률', async () => {
        const subCode = 'JPN';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });
    });

    describe('연간', () => {
      const serviceType = 'StatisticSearch';
      const code = '902Y015';
      const interval = 'A';
      const startDate = '2010';
      const endDate = '2024';
      const skip = 0;
      const limit = 100;

      it('한국 경제성장률', async () => {
        const subCode = 'KOR';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });

      it('미국 경제성장률', async () => {
        const subCode = 'USA';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });

      it('일본 경제성장률', async () => {
        const subCode = 'JPN';
        const url = `https://ecos.bok.or.kr/api/${serviceType}/${apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;

        const res = await axios.get(url);
        const { row, list_total_count } = res?.data?.[serviceType];

        console.log(row, list_total_count);
      });
    });
  });
});
