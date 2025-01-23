import { Redis } from 'ioredis';
import { parse as parseHTML } from 'node-html-parser';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REDIS_NAME } from '@libs/config';
import { ChromiumService, PAGE_PURPOSE } from '@libs/browser';
import { sleep } from '@libs/common';

@Injectable()
export class RealtimeShortInterestCrawler {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly chromiumService: ChromiumService,
  ) {}

  async exec() {
    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.REALTIME_SHORT_INTEREST,
    );

    const ticker = 'smfg';

    await page.goto('chrome://newtab');
    await sleep(100000);
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
    }
    if (items.length === 0) {
      throw new Error('No realtime short interest data found');
    }

    console.log(items);
  }
}
