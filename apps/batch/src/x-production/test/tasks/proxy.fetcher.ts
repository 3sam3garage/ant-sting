import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_NAME } from '@libs/config';
import axios from 'axios';

interface Proxy {
  uptime: number;
  port: number;
  ip: string;
  proxy: string;
}

@Injectable()
export class ProxyFetcher {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
  ) {}

  async exec(): Promise<void> {
    const response = await axios.get(
      'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=json&timeout=20000',
    );

    const proxies: Proxy[] = (response?.data?.proxies || []).filter(
      (proxy: Proxy) => {
        const { uptime, port } = proxy;
        return uptime > 90;
      },
    );

    for (const { ip } of proxies || []) {
      await this.redis.sadd('proxies', ip);
    }
  }
}
