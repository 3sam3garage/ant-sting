import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { joinUrl } from '@libs/common';
import { TrendingPoll } from '@libs/domain';

@Injectable()
export class PolyMarketApi {
  private readonly BASE_URL = 'https://gamma-api.polymarket.com';

  constructor() {}

  async trendingPolls(): Promise<TrendingPoll> {
    const url = joinUrl(this.BASE_URL, '/events/pagination');
    const queries =
      'limit=20&active=true&archived=false&closed=false&order=volume24hr&ascending=false&offset=0';

    const response = await axios.get(`${url}?${queries}`);
    return plainToInstance(TrendingPoll, response?.data);
  }
}
