import { Injectable } from '@nestjs/common';
import { omitIsNil, retry } from '@libs/common';
import axios from 'axios';
import { ExternalApiConfigService } from '@libs/config';
import { GOV_STOCK_INFO_URL } from '../constants';

@Injectable()
export class DataGovApiService {
  constructor(
    private readonly externalApiConfigService: ExternalApiConfigService,
  ) {}

  async getLatestStockPrice(stockName: string): Promise<number> {
    const params = omitIsNil({
      serviceKey: this.externalApiConfigService.dataGoServiceKey,
      resultType: 'json',
      numOfRows: 1,
      itmsNm: stockName.trim(),
      basDt: null,
    });
    const stockInfo = await retry(
      () => axios.get(GOV_STOCK_INFO_URL, { params }),
      3,
    );
    const [item] = stockInfo.data.response.body.items.item;

    return +item?.mkp || 0;
  }
}
