import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { FilingRss, SecFiling, SecTickerResponse } from '../intefaces';
import { DATA_SEC_GOV_HEADERS, SEC_FAIR_ACCESS_HEADERS } from '../constants';

@Injectable()
export class SecApiService {
  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}

  async fetchCompanyTickers(): Promise<SecTickerResponse> {
    const response = await axios.get<SecTickerResponse>(
      'https://www.sec.gov/files/company_tickers.json',
      { headers: SEC_FAIR_ACCESS_HEADERS },
    );

    return response.data;
  }

  async fetchSubmission(tenDigitCIK: string): Promise<SecFiling> {
    const response = await axios.get<SecFiling>(
      `https://data.sec.gov/submissions/${tenDigitCIK}.json`,
      { headers: DATA_SEC_GOV_HEADERS },
    );

    return response.data;
  }

  async fetchFilingDocument(url: string) {
    const response = await axios.get(url, {
      headers: SEC_FAIR_ACCESS_HEADERS,
    });

    return response.data;
  }

  /**
   * @deprecated
   */
  async fetchRSS(start = 0, count = 100): Promise<FilingRss> {
    const response = await axios.get(
      'https://www.sec.gov/cgi-bin/browse-edgar?company=&CIK=&type=13F&owner=include&count=40&action=getcurrent',
      // 'https://www.sec.gov/Archives/edgar/usgaap.rss.xml',
      { params: { start, count }, headers: SEC_FAIR_ACCESS_HEADERS },
    );

    const json: FilingRss = await parseStringPromise(response.data, {
      trim: true,
      explicitArray: false,
      emptyTag: () => null,
    });

    return json;
  }
}
