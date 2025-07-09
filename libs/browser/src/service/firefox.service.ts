import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import { DEFAULT_FIREFOX_OPTIONS_ARGS } from '../constants';

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

  /**
   * @deprecated
   * 파이어폭스에선 안 먹는듯.
   */
  async overrideUserAgentToRandom(page: Page) {
    // user-agent 변조
    await page.setUserAgent(
      new UserAgent({ platform: 'Win32' }).random().toString(),
    );
  }

  async addRequestInterception(page: Page) {
    // request interception
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      const resources = [
        'png',
        'jpg',
        'jpeg',
        'js',
        'svg',
        'png',
        // ?
        'json',
        'css',
        'jpeg',
        'ping',
      ];
      const abort = resources.some((resource) => url.endsWith(resource));

      abort ? req.abort() : req.continue();
    });
  }

  async getPage(): Promise<Page> {
    if (!this.browser) {
      await this.initBrowser();
    }

    const [page] = await this.browser.pages();
    if (!page) {
      return await this.browser.newPage();
    }

    page.removeAllListeners('request');
    await Promise.all([
      this.overrideUserAgentToRandom(page),
      // this.addRequestInterception(page),
    ]);

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
        ...DEFAULT_FIREFOX_OPTIONS_ARGS,
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
