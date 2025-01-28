import { Injectable, Logger } from '@nestjs/common';
import { QUEUE_NAME } from '@libs/config';
import { ChromiumService, PAGE_PURPOSE } from '@libs/browser';
import { ClaudeService, MODEL_TYPE, ANALYZE_NEWS_PROMPT } from '@libs/ai';
import { StockMarketNews, StockMarketNewsRepository } from '@libs/domain';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ObjectId } from 'mongodb';

@Injectable()
export class StockNewsCrawler {
  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_MARKET_NEWS)
    private readonly queue: Queue,
    private readonly chromiumService: ChromiumService,
    private readonly claudeService: ClaudeService,
    private readonly stockMarketNewsRepository: StockMarketNewsRepository,
  ) {}

  private async scrapeList() {
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

  private async scrapeDetail() {
    const entity = await this.stockMarketNewsRepository.findOne({
      where: { _id: new ObjectId('67a4ab72eb104e522601d819') },
    });

    if (!entity) {
      Logger.debug('No StockMarketNews Entity Found');
      return;
    }

    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.REALTIME_SHORT_INTEREST,
    );

    await page.goto('chrome://newtab');
    await page.goto(entity.url, { waitUntil: 'domcontentloaded' });

    const title = await page.evaluate(() => {
      const element: HTMLElement = document.querySelector('#articleTitle');
      return element?.innerText || '';
    });

    const article = await page.evaluate(() => {
      const articleElement: HTMLDivElement =
        document.querySelector('div#article');
      return articleElement?.innerText || '';
    });

    const prompt = ANALYZE_NEWS_PROMPT.replace('{{NEWS}}', article);
    const response = await this.claudeService.invoke(prompt, {
      model: MODEL_TYPE.CLAUDE_HAIKU,
    });

    await this.stockMarketNewsRepository.save({
      ...entity,
      ...response,
      title,
    });
  }

  async exec() {
    await this.scrapeList();
    // await this.scrapeDetail();
  }
}
