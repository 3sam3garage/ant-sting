import { LaunchOptions } from 'puppeteer';

export interface BrowserOptionInterface extends LaunchOptions {
  fastMode?: boolean;
}
