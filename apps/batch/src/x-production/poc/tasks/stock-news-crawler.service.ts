import { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_NAME } from '@libs/config';
import { ChromiumService, PAGE_PURPOSE } from '@libs/browser';
import { sleep } from '@libs/common';

@Injectable()
export class StockNewsCrawler {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly chromiumService: ChromiumService,
  ) {}

  private async scrapeList() {
    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.REALTIME_SHORT_INTEREST,
    );

    await page.goto('chrome://newtab');
    const response = await page.goto(
      `https://www.investing.com/news/stock-market-news`,
    );

    const urls = await page.evaluate(() => {
      const anchors = document.querySelectorAll(
        'ul[data-test=news-list] > li > article > div > a',
      );

      const urls: string[] = [];
      for (const anchor of anchors) {
        urls.push(anchor.getAttribute('href'));
      }

      return urls;
    });

    console.log(urls);
    console.log(response.status());

    await sleep(100000);
  }

  private async scrapeDetail() {
    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.REALTIME_SHORT_INTEREST,
    );

    await page.goto('chrome://newtab');
    await page.goto(
      `https://www.investing.com/news/stock-market-news/white-house-in-talks-to-have-oracle-and-us-investors-take-over-tiktok-npr-reports-3830857`,
      { waitUntil: 'domcontentloaded' },
    );

    const article = await page.evaluate(() => {
      const articleElement: HTMLDivElement =
        document.querySelector('div#article');
      return articleElement?.innerText || '';
    });

    console.log(article);
  }

  async exec() {
    // await this.scrapeList();
    await this.scrapeDetail();
  }
}
