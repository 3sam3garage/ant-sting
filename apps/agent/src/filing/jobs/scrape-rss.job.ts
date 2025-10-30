import { Inject, Injectable, Logger } from '@nestjs/common';
import { QUEUE_NAME } from '@libs/shared/config';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { errorToJson } from '@libs/shared/common';
import { AnalyzeSec13fMessage } from '@libs/shared/core';
import {
  BrowserImpl,
  BROWSERS_TOKEN,
  REDIS_REPOSITORY_TOKEN,
} from '@libs/application';
import { FilingRss, SecFeedRepositoryImpl } from '@libs/domain';
import { parseStringPromise } from 'xml2js';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ScrapeRssJob {
  private isRunning = false;

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_13F)
    private readonly queue: Queue,
    @Inject(REDIS_REPOSITORY_TOKEN.SEC_FEED)
    private readonly secFeedRedisRepository: SecFeedRepositoryImpl,
    @Inject(BROWSERS_TOKEN.CHROMIUM)
    private readonly chromiumService: BrowserImpl,
  ) {}

  async run() {
    const page = await this.chromiumService.getPage();
    await page.goto(
      'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=13F-HR&company=&dateb=&owner=include&output=atom&start=0&count=100',
    );
    const body: string = await page.evaluate(() => {
      return document.querySelector('body').innerText;
    });
    const json: FilingRss = await parseStringPromise(body, {
      trim: true,
      explicitArray: false,
      emptyTag: () => null,
    });

    const rss = plainToInstance(FilingRss, json);

    for (const feed of rss.feedsEntries) {
      const url = feed.href;

      const processed = await this.secFeedRedisRepository.exists(url);
      if (processed) {
        Logger.log(`이미 처리된 URL: ${url}`);
        continue;
      }

      const message: AnalyzeSec13fMessage = { url };
      await Promise.all([
        this.queue.add(message, { removeOnComplete: true }),
        this.secFeedRedisRepository.addToSet(url),
      ]);
    }
  }

  @Cron('*/5 * * * *', { timeZone: 'Asia/Seoul' })
  async handle(): Promise<void> {
    Logger.log(`${new Date()} scrape-sec-rss scheduler start`);

    if (this.isRunning) {
      Logger.warn('이미 scrape-sec-rss 스케줄러가 동작중입니다.');
      return;
    }

    try {
      this.isRunning = true;
      await this.run();
    } catch (error: unknown) {
      Logger.error('scrape-sec-rss 중 에러 발생', errorToJson(error as Error));
    } finally {
      this.isRunning = false;
    }
  }
}
