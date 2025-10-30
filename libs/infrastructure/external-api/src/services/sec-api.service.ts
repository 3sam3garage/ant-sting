import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/shared/config';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { FilingRss, SecFiling } from '@libs/domain';
import { toTenDigitCIK } from '@libs/shared/common';
import { SecApiImpl } from '@libs/application';
import { DATA_SEC_GOV_HEADERS, SEC_FAIR_ACCESS_HEADERS } from '../constants';

@Injectable()
export class SecApiService implements SecApiImpl {
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

  /**
   * @deprecated
   */
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
}
