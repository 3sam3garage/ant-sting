import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import { CorporationRepository } from '@libs/domain';

@Injectable()
export class FinancialStatementTask {
  private readonly URL = 'https://opendart.fss.or.kr/api/fnlttSinglIndx.json';

  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
    private readonly corporationRepo: CorporationRepository,
  ) {}

  async exec(): Promise<void> {
    const res = await axios.get(this.URL, {
      params: {
        crtfc_key: this.externalApiConfigService.openDartApiKey,
        corp_code: '00164742',
        bsns_year: '2022',
        reprt_code: '11014',
        idx_cl_code: 'M230000',
      },
    });

    console.log(res.data);
  }
}
