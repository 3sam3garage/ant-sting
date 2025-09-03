import { Inject, Injectable } from '@nestjs/common';
import { FilingRss } from '@libs/infrastructure/external-api';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/shared/config';
import { Queue } from 'bull';
import { parseStringPromise } from 'xml2js';
import {
  BrowserImpl,
  BROWSERS_TOKEN,
  EXTERNAL_API_TOKEN,
  SecApiImpl,
} from '@libs/application';

@Injectable()
export class ScrapeRssTask {
  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_13F)
    private readonly queue: Queue,
    @Inject(EXTERNAL_API_TOKEN.SEC_API_SERVICE)
    private readonly secApi: SecApiImpl,
    @Inject(BROWSERS_TOKEN.CHROMIUM)
    private readonly chromiumService: BrowserImpl,
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
