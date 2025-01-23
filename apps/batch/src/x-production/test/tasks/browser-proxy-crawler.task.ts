import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { launch, Page, ProtocolError } from 'puppeteer';
import axios from 'axios';
import { random } from 'lodash';
import { Redis } from 'ioredis';
import { parse as parseHTML } from 'node-html-parser';
import { REDIS_NAME } from '@libs/config';
import { REALTIME_SHORT_INTEREST_REDIS_KEY } from '@libs/domain';
import { DEFAULT_BROWSER_OPTIONS_ARGS } from '../constants';

@Injectable()
export class BrowserProxyCrawlerTask {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
  ) {}

  private async run(page: Page) {
    const ticker = 'lexx';

    const response = await page.goto(`https://fintel.io/ko/ss/us/${ticker}`);
    if (response?.status() === 403) {
      throw new ForbiddenException();
    }

    const table = await page.evaluate(() => {
      const tableElement = document.querySelector(
        'div#short-shares-availability div.row table#short-shares-availability-table',
      );

      return tableElement?.innerHTML || '';
    });

    const html = parseHTML(table);

    const items = [];
    const rows = html.querySelectorAll('tbody > tr');
    for (const row of rows) {
      const [relativeTime, timestamp, quantity] = row.querySelectorAll('td');
      items.push({
        relativeTime: relativeTime?.innerText?.trim(),
        timestamp: new Date(timestamp?.innerText?.trim() + 'Z'),
        quantity: +quantity?.innerText?.trim().replaceAll(',', ''),
      });

      console.log(timestamp?.innerText?.trim());
    }

    if (items.length > 0) {
      await this.redis.set(
        `${REALTIME_SHORT_INTEREST_REDIS_KEY}:${ticker.toUpperCase()}`,
        JSON.stringify(items),
      );
    }
  }

  private async figureProxy(): Promise<void> {
    const response = await axios.get(
      'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=json&timeout=20000',
    );

    const proxies: any[] = (response?.data?.proxies || []).filter((proxy) => {
      const { uptime, port, ssl } = proxy;
      return port === 443;
    });

    for (const { ip } of proxies || []) {
      await this.redis.sadd('proxies', ip);
    }
  }

  async exec(): Promise<void> {
    // await this.figureProxy();

    const proxyIps = await this.redis.smembers('proxies');
    const index = random(0, proxyIps.length - 1);

    console.log(proxyIps);

    const ip = proxyIps[index];

    const browser = await launch({
      args: [
        ...DEFAULT_BROWSER_OPTIONS_ARGS,
        '--disable-site-isolation-trials',
      ],
      // extraPrefsFirefox: {
      //   'network.proxy.type': 1,
      //   'network.proxy.ssl': ip,
      //   'network.proxy.ssl_port': 443,
      // },
      defaultViewport: { height: 2500, width: 1920 },
      headless: false,
      browser: 'firefox',
      devtools: true,
    });

    const [page] = await browser.pages();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      switch (true) {
        case req.url().endsWith('png'):
        case req.url().endsWith('jpg'):
        case req.url().endsWith('jpeg'):
        case req.url().endsWith('css'):
        case req.url().endsWith('js'):
        case req.url().endsWith('svg'):
          req.abort();
          break;
        default:
          req.continue();
      }
    });

    try {
      await this.run(page);
    } catch (e) {
      if (e instanceof ProtocolError || e instanceof ForbiddenException) {
        await this.redis.srem('proxies', ip);
      }

      console.error(e);
    } finally {
      await browser.close();
      console.debug('수집 완료!');
    }
  }
}
