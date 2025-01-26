import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import {
  DEFAULT_CHROMIUM_OPTION_ARGS,
  PAGE_PURPOSE,
  TYPES_TO_BLOCK,
} from '../constants';

@Injectable()
export class ChromiumService implements OnModuleInit, OnModuleDestroy {
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
   * 쓰지마셈
   */
  async getBrowser() {
    if (!this.browser) {
      await this.browser.close();
      await this.initBrowser();
    }

    return this.browser;
  }

  // user-agent 변조
  async overrideUserAgentToRandom(page: Page) {
    await page.setUserAgent(
      new UserAgent({ platform: 'Win32' }).random().toString(),
    );
  }

  async addRequestInterception(page: Page) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      TYPES_TO_BLOCK.includes(req.resourceType())
        ? req.abort()
        : req.continue();
    });
  }

  async getPage(purpose: PAGE_PURPOSE) {
    const pages = await this.browser.pages();
    let page = pages[purpose];

    if (!page) {
      page = await this.browser.newPage();
    }

    await Promise.all([
      this.overrideUserAgentToRandom(page),
      this.addRequestInterception(page),
    ]);

    return page;
  }

  async initBrowser() {
    const browser = await launch({
      args: [...DEFAULT_CHROMIUM_OPTION_ARGS],
      defaultViewport: { height: 1080, width: 1920 },
      headless: true,
      browser: 'chrome',
      devtools: true,
    });

    this.browser = browser;
  }
}
