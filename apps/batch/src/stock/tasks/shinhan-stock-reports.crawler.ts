import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import axios from 'axios';
import {
  ForeignStockReport,
  ForeignStockReportRepository,
  MARKET_TYPE,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { eucKR2utf8, formatEightDigitDate } from '@libs/common';
import { ShinhanReportItem } from '../interface';

@Injectable()
export class ShinhanStockReportsCrawler {
  private TICKER_REGEX = new RegExp(/\(.+(\.|\s)\w{1,2}\)/);
  private URL =
    'https://bbs2.shinhansec.com/mobile/json.list.do?boardName=foreignstock&curPage=1';

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_STOCK_PDF)
    private readonly queue: Queue,
    private readonly foreignStockReport: ForeignStockReportRepository,
  ) {}

  async exec() {
    const response = await axios.get(this.URL, { responseType: 'arraybuffer' });
    const text = eucKR2utf8(response.data);
    const json = JSON.parse(text);

    const items: ShinhanReportItem[] = [];
    for (const item of json.list) {
      for (const [key, value] of Object.entries(item)) {
        const fieldName = json.title[key];
        item[fieldName] = value;
        delete item[key];
      }
      items.push(item);
    }

    for (const item of items) {
      const { 등록일, 파일명, 제목, 구분 } = item;

      // (AAPL.US) 포맷의 데이터. 해당 데이터가 없으면 시장구분을 할 수 없으므로 버린다.
      const [marketInfo] = 구분.match(this.TICKER_REGEX) || [];
      if (구분 === '-' || !marketInfo) {
        Logger.debug(`구분: ${구분}`);
        continue;
      }

      const stockName = 구분.replace(this.TICKER_REGEX, '');

      const [code, market] = marketInfo
        ?.replace('(', '')
        ?.replace(')', '')
        ?.split(/\.|\s/);

      const report = ForeignStockReport.create({
        uuid: `shinhan:${new URL(파일명).searchParams.get('attachmentId')}`,
        title: 제목,
        file: 파일명,
        stockName,
        stockFirm: '신한투자증권',
        code,
        market: market as MARKET_TYPE,
        date: formatEightDigitDate(등록일),
      });

      const entity = await this.foreignStockReport.findOneByUid(report.uuid);
      if (entity) {
        continue;
      }

      const result = await this.foreignStockReport.save(report);
      await this.queue.add(
        { stockReportId: result._id.toString() },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
  }
}
