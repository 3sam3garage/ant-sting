import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from '@libs/config';
import { ChromiumService, PAGE_PURPOSE } from '@libs/browser';
import { StockMarketNews, StockMarketNewsRepository } from '@libs/domain';

@Injectable()
export class StockMarketNewsListScraper {
  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_MARKET_NEWS)
    private readonly queue: Queue,
    private readonly chromiumService: ChromiumService,
    private readonly stockMarketNewsRepository: StockMarketNewsRepository,
  ) {}

  async exec() {
    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.REALTIME_SHORT_INTEREST,
    );

    await page.goto('chrome://newtab');
    const response = await page.goto(
      `https://www.investing.com/news/stock-market-news`,
      { waitUntil: 'load' },
    );

    console.log(response.status());

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

    for (const url of urls) {
      const foundEntity = await this.stockMarketNewsRepository.findOne({
        where: { url },
      });

      if (foundEntity) {
        continue;
      }

      const entity = StockMarketNews.create({ url });
      const result = await this.stockMarketNewsRepository.save(entity);

      await this.queue.add(
        { newsId: result._id.toString() },
        { removeOnComplete: true },
      );
    }
  }
}
