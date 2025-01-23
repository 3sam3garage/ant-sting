import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import { DEFAULT_BROWSER_OPTIONS_ARGS, PAGE_PURPOSE } from '../constants';

@Injectable()
export class FirefoxService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  constructor() {}

  async onModuleInit() {
    await this.initBrowser();
  }

  async onModuleDestroy() {
    await this.browser.close();
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
      const resources = ['png', 'jpg', 'jpeg'];
      const abort = resources.some((resource) => url.endsWith(resource));

      abort ? req.abort() : req.continue();
    });

    return page;
  }

  async initBrowser(proxyIp?: string) {
    let extraPrefsFirefox: Record<string, unknown> = {};
    if (proxyIp) {
      extraPrefsFirefox = {
        'network.proxy.type': 1,
        'network.proxy.ssl': proxyIp,
        'network.proxy.ssl_port': 443,
      };
    }

    const browser = await launch({
      args: [
        ...DEFAULT_BROWSER_OPTIONS_ARGS,
        '--disable-site-isolation-trials', // page request interception 에 필요.
      ],
      extraPrefsFirefox,
      defaultViewport: { height: 1080, width: 1920 },
      headless: false,
      browser: 'firefox',
      devtools: true,
    });

    this.browser = browser;
  }
}
