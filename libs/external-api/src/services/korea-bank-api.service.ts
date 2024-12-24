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

  async fetchExchangeRate(param: EcosSearchInterface) {
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

  async fetchBondYieldInTerms(param: EcosSearchInterface) {
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

  async fetchBaseInterestRate(param: EcosSearchInterface) {
    const {
      code = '722Y001',
      subCode = '0101000',
      interval = 'M',
      startDate,
      endDate,
      skip = 0,
      limit = 100,
    } = param;

    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${this.apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;
    const response = await axios.get<EcosSearchResponse>(url);
    return response?.data;
  }

  async fetchPolicyBaseInterestRate(param: EcosSearchInterface) {
    const {
      code = '902Y006',
      subCode = 'KR',
      interval = 'M',
      startDate,
      endDate,
      skip = 0,
      limit = 100,
    } = param;

    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${this.apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;
    const response = await axios.get<EcosSearchResponse>(url);
    return response?.data;
  }

  async fetchStockIndex(param: EcosSearchInterface) {
    const {
      code = '902Y002',
      subCode = 'KOR',
      interval = 'M',
      startDate,
      endDate,
      skip = 0,
      limit = 100,
    } = param;

    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${this.apiKey}/json/kr/${skip}/${limit}/${code}/${interval}/${startDate}/${endDate}/${subCode}`;
    const response = await axios.get<EcosSearchResponse>(url);
    return response?.data;
  }
}
