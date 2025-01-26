import { Redis } from 'ioredis';
import { parse as parseHTML } from 'node-html-parser';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { REALTIME_SHORT_INTEREST_REDIS_KEY } from '@libs/domain';
import { QUEUE_NAME, REDIS_NAME } from '@libs/config';
import { sleep } from '@libs/common';
import { ChromiumService, PAGE_PURPOSE } from '@libs/browser';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.SCRAPE_REALTIME_SHORT)
export class RealtimeShortInterestConsumer extends BaseConsumer {
  constructor(
    @Inject(REDIS_NAME.ANT_STING)
    private readonly redis: Redis,
    private readonly chromiumService: ChromiumService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { ticker } }: Job<{ ticker: string }>) {
    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.REALTIME_SHORT_INTEREST,
    );

    await page.goto('chrome://newtab');
    await sleep(1000);
    const response = await page.goto(`https://fintel.io/ko/ss/us/${ticker}`, {
      waitUntil: 'domcontentloaded',
    });
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
      throw new NotFoundException('No realtime short interest data found');
    }

    await this.redis.set(
      `${REALTIME_SHORT_INTEREST_REDIS_KEY}:${ticker}`,
      JSON.stringify(items),
    );
  }
}
