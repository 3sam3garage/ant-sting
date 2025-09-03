import { Page } from 'puppeteer';

export interface BrowserImpl {
  getPage(): Promise<Page>;
}
