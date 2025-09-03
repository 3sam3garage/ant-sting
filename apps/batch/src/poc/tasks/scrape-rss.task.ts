import { Injectable } from '@nestjs/common';
import { FilingRss, SecApiService } from '@libs/infrastructure/external-api';
import { ChromiumService } from '@libs/infrastructure/browser';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { Queue } from 'bull';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class ScrapeRssTask {
  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_13F)
    private readonly queue: Queue,
    private readonly secApi: SecApiService,
    private readonly chromiumService: ChromiumService,
  ) {}

  async exec() {
    const page = await this.chromiumService.getPage();
    await page.goto(
      // 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=&company=&dateb=&owner=include&output=atom',
      'https://www.sec.gov/cgi-bin/browse-edgar?company=&CIK=&type=13F-HR&owner=include&count=40&action=getcurrent&output=atom',
    );

    const text = await page.evaluate(() => {
      return document.querySelector('pre').innerText;
    });

    const parsed: FilingRss = await parseStringPromise(text, {
      trim: true,
      explicitArray: false,
      emptyTag: () => null,
    });

    for (const entry of parsed?.feed?.entry || []) {
      const url = entry.link.$.href;
      const form = entry.category.$.term;
      console.log(form, url);
    }

    console.log(1);
  }
}
