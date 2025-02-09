import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { ObjectId } from 'mongodb';
import { Logger } from '@nestjs/common';
import { StockMarketNewsRepository } from '@libs/domain';
import { ANALYZE_NEWS_PROMPT, ClaudeService, MODEL_TYPE } from '@libs/ai';
import { QUEUE_NAME } from '@libs/config';
import { BrowserFactory } from '@libs/browser';
import { BaseConsumer } from '../../base.consumer';

// @todo 얘는 별도 컨슈머로 분리 필요할듯.
@Processor(QUEUE_NAME.ANALYZE_MARKET_NEWS)
export class StockMarketNewsConsumer extends BaseConsumer {
  private browserFactory: BrowserFactory;

  constructor(
    private readonly stockMarketNewsRepository: StockMarketNewsRepository,
    private readonly claudeService: ClaudeService,
  ) {
    super();
    this.browserFactory = new BrowserFactory({
      fastMode: true,
      headless: true,
    });
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

    const page = await this.browserFactory.getPage();
    await page.goto('chrome://newtab');
    const pageResponse = await page.goto(entity.url, {
      waitUntil: 'domcontentloaded',
    });
    if (pageResponse.status() !== 200) {
      Logger.debug(`Investings.com response: ${pageResponse.status()}`);
    }

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

    // 브라우저 초기화
    await this.browserFactory.restart();
  }
}
