import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { QUEUE_NAME } from '@libs/config';
import { ChromiumService, PAGE_PURPOSE } from '@libs/browser';
import { StockMarketNewsRepository } from '@libs/domain';
import { Logger } from '@nestjs/common';
import { ANALYZE_NEWS_PROMPT, ClaudeService, MODEL_TYPE } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';
import { ObjectId } from 'mongodb';

// @todo 얘는 별도 컨슈머로 분리 필요할듯.
@Processor(QUEUE_NAME.ANALYZE_MARKET_NEWS)
export class StockMarketNewsConsumer extends BaseConsumer {
  constructor(
    private readonly chromiumService: ChromiumService,
    private readonly stockMarketNewsRepository: StockMarketNewsRepository,
    private readonly claudeService: ClaudeService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { newsId } }: Job<{ newsId: string }>) {
    const entity = await this.stockMarketNewsRepository.findOne({
      where: { _id: new ObjectId(newsId) },
    });

    if (!entity) {
      Logger.debug('No StockMarketNews Entity Found');
      return;
    }

    const page = await this.chromiumService.getPage(
      PAGE_PURPOSE.STOCK_MARKET_NEWS,
      { resetBrowser: true },
    );

    await page.goto('chrome://newtab');
    const pageResponse = await page.goto(entity.url, {
      waitUntil: 'domcontentloaded',
    });

    console.log(pageResponse.status());

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
}
