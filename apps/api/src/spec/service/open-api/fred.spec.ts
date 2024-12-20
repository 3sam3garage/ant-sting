import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, ExternalApiConfigService } from '@libs/config';

describe('fred', () => {
  let moduleRef: TestingModule;
  let apiKey: string;
  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [ExternalApiConfigService],
    }).compile();

    const externalConfigService = moduleRef.get(ExternalApiConfigService);

    apiKey = externalConfigService.fredApiKey;
  });

  describe('채권 금리(수익률)', () => {
    it('DGS10 - 미국채 10년물 금리', async () => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=${apiKey}&file_type=json`;

      const res = await axios.get(url);

      console.log(res.data);
    });

    it('DGS5 - 미국채 5년물 금리', async () => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DGS5&api_key=${apiKey}&file_type=json`;

      const res = await axios.get(url);

      console.log(res.data);
    });

    it('DGS3 - 미국채 3년물 금리', async () => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DGS3&api_key=${apiKey}&file_type=json`;

      const res = await axios.get(url);

      console.log(res.data);
    });

    it('DGS1 - 미국채 1년물 금리', async () => {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DGS1&api_key=${apiKey}&file_type=json`;

      const res = await axios.get(url);

      console.log(res.data);
    });
  });

  it('실업률', async () => {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=${apiKey}&file_type=json`;

    const res = await axios.get(url);

    console.log(res.data);
  });
});
