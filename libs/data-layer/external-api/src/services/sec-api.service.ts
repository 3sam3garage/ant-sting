import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { FilingRss, SecFiling, SecTickerResponse } from '../adapters';
import { DATA_SEC_GOV_HEADERS, SEC_FAIR_ACCESS_HEADERS } from '../constants';
import { toTenDigitCIK } from '@libs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SecApiService {
  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}

  async fetchSubmission(cik: string): Promise<SecFiling> {
    const formattedCIK = 'CIK' + toTenDigitCIK(cik);

    const response = await axios.get<SecFiling>(
      `https://data.sec.gov/submissions/${formattedCIK}.json`,
      { headers: DATA_SEC_GOV_HEADERS },
    );

    return plainToInstance(SecFiling, response.data);
  }

  async fetchRSS(start = 0, count = 100): Promise<FilingRss> {
    const response = await axios.get(
      'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=13F-HR&company=&dateb=&owner=include&output=atom',
      {
        params: { start, count },
        headers: SEC_FAIR_ACCESS_HEADERS,
      },
    );

    const json: FilingRss = await parseStringPromise(response.data, {
      trim: true,
      explicitArray: false,
      emptyTag: () => null,
    });

    return plainToInstance(FilingRss, json);
  }

  /**
   * @deprecated
   */
  async fetchFilingDocument(url: string) {
    const response = await axios.get(url, {
      headers: SEC_FAIR_ACCESS_HEADERS,
    });

    return response;
  }

  /**
   * @deprecated
   */
  async fetchCompanyTickers(): Promise<SecTickerResponse> {
    const response = await axios.get<SecTickerResponse>(
      'https://www.sec.gov/files/company_tickers.json',
      { headers: SEC_FAIR_ACCESS_HEADERS },
    );

    return plainToInstance(SecTickerResponse, response.data);
  }
}
