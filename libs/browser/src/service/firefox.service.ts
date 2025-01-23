import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import { random } from 'lodash';
import { REDIS_NAME } from '@libs/config';
import { Redis } from 'ioredis';
import { DEFAULT_BROWSER_OPTIONS_ARGS, PAGE_PURPOSE } from '../constants';

@Injectable()
export class FirefoxService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;
  private ip: string;

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
  ) {}

  async onModuleInit() {
    await this.initBrowser();
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  private async figureProxyIp() {
    const proxyIps = await this.redis.smembers('proxies');
    const index = random(0, proxyIps.length - 1);

    return proxyIps[index];
  }

  async getPage(purpose: PAGE_PURPOSE = 0): Promise<Page> {
    const pages = await this.browser.pages();
    let page = pages[purpose];

    page = page ? page : await this.browser.newPage();

    page.setDefaultTimeout(5 * 1000);

    // user-agent 변조
    await page.setUserAgent(
      new UserAgent({ platform: 'Win32' }).random().toString(),
    );

    // request interception
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      switch (true) {
        case url.endsWith('png'):
        case url.endsWith('jpg'):
        case url.endsWith('jpeg'):
        case url.endsWith('css'):
        case url.endsWith('js'):
        case url.endsWith('svg'):
          req.abort();
          break;
        default:
          req.continue();
          break;
      }
    });

    return page;
  }

  async initBrowser(proxy: boolean = false) {
    this.ip = await this.figureProxyIp();

    let extraPrefsFirefox: Record<string, unknown> = {};
    if (proxy) {
      extraPrefsFirefox = {
        'network.proxy.type': 1,
        'network.proxy.ssl': this.ip,
        'network.proxy.ssl_port': 443,
      };
    }

    const browser = await launch({
      args: [
        ...DEFAULT_BROWSER_OPTIONS_ARGS,
        '--disable-site-isolation-trials', // page request interception 에 필요.
      ],
      extraPrefsFirefox,
      defaultViewport: { height: 2500, width: 1920 },
      headless: false,
      browser: 'firefox',
      devtools: true,
    });

    this.browser = browser;
  }
}
