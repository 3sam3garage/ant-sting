import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import axios from 'axios';
import { format, subMonths } from 'date-fns';
import {
  KIWOOM_BASE_URL,
  StockReport,
  StockReportRepository,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl } from '@libs/common';

@Injectable()
export class KiwoomStockReportsCrawler {
  private KIWOOM_RESEARCH_URL = joinUrl(
    KIWOOM_BASE_URL,
    '/research/SResearchCCListAjax',
  );
  private KIWOOM_BASE_PDF_URL = joinUrl(
    KIWOOM_BASE_URL,
    '/research/SPdfFileView',
  );
  private TICKER_REGEX = new RegExp(/\(.+(\.|\s)\w{2}\)/);

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_STOCK)
    private readonly queue: Queue,
    private readonly stockReportRepo: StockReportRepository,
  ) {}

  private buildFormData() {
    const now = new Date();
    const edDate = format(now, 'yyyyMMdd');
    const stDate = format(subMonths(now, 6), 'yyyyMMdd');

    const form = new FormData();
    form.append('pageNo', '1');
    form.append('pageSize', '100');
    form.append('stdate', stDate);
    form.append('eddate', edDate);
    form.append('f_keyField', '');
    form.append('f_key', '');
    form.append('_reqAgent', 'ajax');

    return form;
  }

  async exec() {
    const form = this.buildFormData();
    const response = await axios.post(this.KIWOOM_RESEARCH_URL, form);
    const items = response?.data?.researchList || [];

    const stockReports: StockReport[] = [];
    for (const item of items) {
      const { titl, attaFile, makeDt, rSqno } = item;

      const { '0': match, index } = titl?.match(this.TICKER_REGEX) || {};
      if (!match) {
        Logger.debug('Not a stock-report report');
        continue;
      }

      const stockName = titl?.substring(0, index)?.replace(/\[.+\]/g, '');

      const [code, market] = match
        ?.replace('(', '')
        ?.replace(')', '')
        ?.split(/\.|\s/);

      const filePath = new URL(this.KIWOOM_BASE_PDF_URL);
      filePath.searchParams.set('rMenuGb', 'CC');
      filePath.searchParams.set('attaFile', attaFile);
      filePath.searchParams.set('makeDt', makeDt);

      const entity = StockReport.create({
        uuid: `kiwoom:${rSqno}`,
        stockFirm: '키움증권',
        title: titl,
        stockName,
        code,
        market,
        date: format(new Date(makeDt), 'yyyy-MM-dd'),
        file: filePath.toString(),
      });
      stockReports.push(entity);
    }

    for (const stockReport of stockReports) {
      const foundReport = await this.stockReportRepo.findOneByUid(
        stockReport.uuid,
      );
      if (foundReport) {
        Logger.debug('Report Already exists:', stockReport.uuid);
        continue;
      }

      const result = await this.stockReportRepo.save(stockReport);
      await this.queue.add(
        { stockReportId: result._id.toString() },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
  }
}
