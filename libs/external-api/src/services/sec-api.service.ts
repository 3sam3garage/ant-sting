import { Injectable } from '@nestjs/common';
import { ExternalApiConfigService } from '@libs/config';
import axios from 'axios';
import { SecFiling } from '../intefaces';
import { DATA_SEC_GOV_HEADERS } from '../constants';

@Injectable()
export class SecApiService {
  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}

  async fetchFilings(tenDigitCIK: string): Promise<SecFiling> {
    const response = await axios.get<SecFiling>(
      `https://data.sec.gov/submissions/${tenDigitCIK}.json`,
      { headers: DATA_SEC_GOV_HEADERS },
    );

    return response.data;
  }

  async fetchFilingDocument(url: string) {
    const response = await axios.get(url, {
      headers: { ...DATA_SEC_GOV_HEADERS, Host: 'www.sec.gov' },
    });

    return response.data;
  }
}
