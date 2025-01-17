import axios from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Cron } from '@nestjs/schedule';
import { REDIS_NAME } from '@libs/config';

interface Proxy {
  uptime: number;
  port: number;
  ip: string;
  proxy: string;
}

@Injectable()
export class FetchProxyJob {
  private isRunning = false;

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
  ) {}

  async run() {
    const response = await axios.get(
      'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=json&timeout=20000',
    );

    const proxies: Proxy[] = (response?.data?.proxies || []).filter(
      (proxy: Proxy) => {
        const { uptime, port } = proxy;
        return uptime > 90 && port === 443;
      },
    );

    for (const { ip } of proxies || []) {
      await this.redis.sadd('proxies', ip);
    }
  }

  @Cron('*/10 * * * *', { timeZone: 'Asia/Seoul' })
  async handle(): Promise<void> {
    Logger.log(`${new Date()} fetch-proxy scheduler start`);

    if (this.isRunning) {
      Logger.warn('이미 fetch-proxy 스케줄러가 동작중입니다.');
      return;
    }

    try {
      this.isRunning = true;
      await this.run();
    } catch (error: unknown) {
      Logger.error('fetch-proxy 중 에러 발생', { error: error.toString() });
    } finally {
      this.isRunning = false;
    }
  }
}
