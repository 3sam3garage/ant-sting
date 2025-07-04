import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { joinUrl } from '@libs/common';

@Injectable()
export class KcifApi {
  private readonly BASE_URL = 'https://www.kcif.or.kr';

  constructor() {}

  async scrapeDetailPage(fullPath: string): Promise<string> {
    const response = await axios.get(fullPath);
    return response.data;
  }

  /**
   * 국제금융속보
   */
  async scrapeNewsFlash(): Promise<string> {
    const url = joinUrl(this.BASE_URL, '/annual/newsflashList');
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * 주간보고서
   */
  async scrapeWeekly(): Promise<string> {
    const url = joinUrl(this.BASE_URL, '/annual/weeklyList');
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * 특별일보
   */
  async scrapeDaily(): Promise<string> {
    const url = joinUrl(this.BASE_URL, '/annual/dailyList');
    const response = await axios.get(url);
    return response.data;
  }
}
