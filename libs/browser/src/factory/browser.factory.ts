import { Browser, launch, Page } from 'puppeteer';
import UserAgent from 'user-agents';
import { BrowserOptionInterface } from '../interface';
import { DEFAULT_CHROMIUM_OPTION_ARGS, TYPES_TO_BLOCK } from '../constants';

export class BrowserFactory {
  browser: Browser;
  options: BrowserOptionInterface;

  constructor(options: BrowserOptionInterface) {
    this.options = options || {};
  }

  async init() {
    this.browser = await this.createBrowser(this.options);
  }

  // async getBrowser(): Promise<Browser> {
  //   if (!this.browser) {
  //     this.browser = await this.createBrowser(this.options);
  //   }
  //
  //   return this.browser;
  // }

  async createBrowser(options: BrowserOptionInterface): Promise<Browser> {
    const { fastMode, ...launchOptions } = options;

    const browser = await launch({
      ...launchOptions,
      defaultViewport: { width: 1366, height: 768 },
      args: DEFAULT_CHROMIUM_OPTION_ARGS,
    });

    if (fastMode) {
      const [page] = await browser.pages();
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        TYPES_TO_BLOCK.includes(resourceType) ? req.abort() : req.continue();
      });
    }

    return browser;
  }

  async getPage(): Promise<Page> {
    if (!this.browser) {
      await this.init();
    }

    const [page] = await this.browser.pages();
    await page.setUserAgent(
      new UserAgent({ platform: 'Win32' }).random().toString(),
    );
    await page.setDefaultTimeout(5 * 1000);

    return page;
  }

  async randomizeUserAgent() {
    const [page] = await this.browser.pages();
    await page.setUserAgent(
      new UserAgent({ deviceCategory: 'desktop' }).random().toString(),
    );
  }

  async restart(): Promise<void> {
    await this.browser.close();
    this.browser = await this.createBrowser(this.options);
  }

  async terminate(): Promise<void> {
    await this.browser.close();
    this.browser = null;
  }
}
