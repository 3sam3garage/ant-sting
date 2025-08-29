import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { joinUrl } from '@libs/common';
import { PolyMarketResponse } from '../interfaces';

@Injectable()
export class PolyMarketApi {
  private readonly BASE_URL = 'https://gamma-api.polymarket.com';

  constructor() {}

  async trendingPolls(): Promise<PolyMarketResponse> {
    const url = joinUrl(this.BASE_URL, '/events/pagination');
    const queries =
      'limit=20&active=true&archived=false&closed=false&order=volume24hr&ascending=false&offset=0';

    const response = await axios.get(`${url}?${queries}`);
    return response?.data;
  }
}
