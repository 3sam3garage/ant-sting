import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import axios from 'axios';
import { parse as parseHTML } from 'node-html-parser';
import {
  ForeignStockReport,
  ForeignStockReportRepository,
  HANA_BASE_URL,
  MARKET_TYPE,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { formatEightDigitDate, joinUrl } from '@libs/common';

@Injectable()
export class HanaStockReportsCrawler {
  private TICKER_REGEX = new RegExp(/\(.+(\.|\s)\w{2}\)/);
  private readonly HANA_RESEARCH_URL = joinUrl(
    HANA_BASE_URL,
    '/main/research/research/list.cmd?pid=8&cid=3',
  );

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_STOCK_PDF)
    private readonly queue: Queue,
    private readonly foreignStockReport: ForeignStockReportRepository,
  ) {}

  async exec() {
    const response = await axios.get(this.HANA_RESEARCH_URL, {
      responseType: 'json',
    });
    const html = parseHTML(response.data);
    const rows = html.querySelectorAll(
      '#container div.daily_bbs > ul > li > div.con',
    );

    for (const row of rows) {
      const titleAnchor = row.querySelector('a.more_btn');
      const title = titleAnchor?.innerText?.trim();
      const fileAnchor = row.querySelector('a.j_fileLink');
      const href = fileAnchor?.getAttribute('href');
      const file = joinUrl(HANA_BASE_URL, href);
      const dateAnchor = row.querySelector('span.txtbasic');

      const [marketInfo] = title.split(':');
      const stockName = marketInfo.replace(this.TICKER_REGEX, '')?.trim();

      const [match] = marketInfo?.match(this.TICKER_REGEX);
      const [code, market] = match
        ?.replace('(', '')
        ?.replace(')', '')
        ?.split(/\.|\s/);

      const report = ForeignStockReport.create({
        stockName,
        code,
        title,
        stockFirm: '하나증권',
        file,
        market: market as MARKET_TYPE,
        date: formatEightDigitDate(dateAnchor.innerText),
        uuid: `hana:${new URL(file).searchParams.get('bbsSeq')}`,
      });

      const entity = await this.foreignStockReport.findOneByUid(report.uuid);
      if (entity) {
        return;
      }

      const result = await this.foreignStockReport.save(report);
      await this.queue.add(
        { stockReportId: result._id.toString() },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
  }
}
