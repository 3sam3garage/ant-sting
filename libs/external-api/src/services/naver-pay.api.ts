import { Injectable } from '@nestjs/common';
import iconv from 'iconv-lite';
import axios from 'axios';
import { joinUrl } from '@libs/common';

@Injectable()
export class NaverPayApi {
  private readonly BASE_URL = 'https://finance.naver.com';
  private readonly REQUEST_HEADERS = {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
  };

  constructor() {}

  private eucKR2utf8(buffer: Buffer) {
    const modifiedBuffer = iconv.decode(buffer, 'EUC-KR');
    return Buffer.from(modifiedBuffer).toString('utf-8');
  }

  async scrapeMarketInfo() {
    const url = joinUrl(this.BASE_URL, 'research/market_info_list.naver');

    const response = await axios.get(url, {
      headers: { ...this.REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    return this.eucKR2utf8(response.data);
  }

  async scrapeInvestInfo() {
    const url = joinUrl(this.BASE_URL, 'research/invest_list.naver');

    const response = await axios.get(url, {
      headers: { ...this.REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    return this.eucKR2utf8(response.data);
  }

  async scrapeEconomyInfo() {
    const url = joinUrl(this.BASE_URL, 'research/economy_list.naver');

    const response = await axios.get(url, {
      headers: { ...this.REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    return this.eucKR2utf8(response.data);
  }

  async scrapeDebentureInfo() {
    const url = joinUrl(this.BASE_URL, 'research/debenture_list.naver');

    const response = await axios.get(url, {
      headers: { ...this.REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    return this.eucKR2utf8(response.data);
  }

  async scrapeDetailPage(path: string) {
    const url = joinUrl(this.BASE_URL, 'research', path);

    const response = await axios.get(url, {
      headers: { ...this.REQUEST_HEADERS },
      responseType: 'arraybuffer',
    });

    return this.eucKR2utf8(response.data);
  }
}
