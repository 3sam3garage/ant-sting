import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import { EcosSearchInterface, EcosSearchResponse } from '../intefaces';

@Injectable()
export class KoreaBankApiService {
  private readonly apiKey: string;

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {
    this.apiKey = this.externalApiConfigService.ecosApiKey;
  }

  async getExchangeRate(param: EcosSearchInterface) {
    const {
      code,
      interval,
      startDate,
      endDate,
      subCode = '?',
      skip = 0,
      limit = 100,
    } = param;

    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${this.apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;
    const response = await axios.get<EcosSearchResponse>(url);
    return response?.data;
  }

  async getBondYieldInTerms(param: EcosSearchInterface) {
    const {
      code = '902Y023',
      interval = 'M',
      startDate,
      endDate,
      skip = 0,
      limit = 100,
    } = param;

    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${this.apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}`;
    const response = await axios.get<EcosSearchResponse>(url);
    return response?.data;
  }
}
