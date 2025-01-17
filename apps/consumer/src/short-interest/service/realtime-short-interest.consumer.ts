import { random } from 'lodash';
import { Redis } from 'ioredis';
import { parse as parseHTML } from 'node-html-parser';
import { Browser, launch, Page } from 'puppeteer';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TickerRepository } from '@libs/domain';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { BaseConsumer } from '../../base.consumer';
import { DEFAULT_BROWSER_OPTIONS_ARGS } from '../constants';
import { sleep } from '@libs/common';

@Processor(QUEUE_NAME.SCRAPE_REALTIME_SHORT)
export class RealtimeShortInterestConsumer
  extends BaseConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private browser: Browser;
  private page: Page;

  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly tickerRepository: TickerRepository,
  ) {
    super();
  }

  private async figureProxyIp() {
    const proxyIps = await this.redis.smembers('proxies');
    const index = random(0, proxyIps.length - 1);

    return proxyIps[index];
  }

  async onModuleInit() {
    await this.initBrowser();
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  async initBrowser() {
    const ip = await this.figureProxyIp();

    const browser = await launch({
      args: DEFAULT_BROWSER_OPTIONS_ARGS,
      extraPrefsFirefox: {
        'network.proxy.type': 1,
        'network.proxy.ssl': ip,
        'network.proxy.ssl_port': 443,
      },
      defaultViewport: { height: 2500, width: 1920 },
      headless: true,
      browser: 'firefox',
      // devtools: true,
    });

    const [page] = await browser.pages();

    this.browser = browser;
    this.page = page;
  }

  async exec(page: Page, ticker: string) {
    if (!this.page) {
      await sleep(3 * 1000);
    }

    await this.page.goto(`https://fintel.io/ko/ss/us/${ticker}`);

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

      // console.log(timestamp?.innerText?.trim());
    }
    await this.redis.set(
      `realtime-short-interest:${ticker}`,
      JSON.stringify(items),
    );
  }

  @Process({ concurrency: 1 })
  async run({ data: { ticker } }: Job<{ ticker: string }>) {
    try {
      await this.exec(this.page, ticker);
    } catch (e) {
      Logger.error(e.message);
      throw e;
    } finally {
      await this.browser.close();
      await this.initBrowser();
    }
  }
}
