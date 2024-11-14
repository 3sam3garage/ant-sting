import { ObjectId } from 'mongodb';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import {
  MacroEnvironmentMessage,
  MacroEnvironmentRepository,
  N_PAY_RESEARCH_URL,
  REPORT_TYPE,
} from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl, requestAndParseEucKr } from '@libs/common';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.MACRO_ENVIRONMENT)
export class MarketInfoReportConsumer extends BaseConsumer {
  constructor(private readonly repo: MacroEnvironmentRepository) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data }: Job<MacroEnvironmentMessage>) {
    const { documentId, url, reportType } = data;
    const html = await requestAndParseEucKr(joinUrl(N_PAY_RESEARCH_URL, url));
    const summary = html
      .querySelectorAll('table td.view_cnt p')
      .map((item) => item?.innerText?.trim())
      .join('\n');

    const macro = await this.repo.findOneById(new ObjectId(documentId));
    switch (reportType) {
      case REPORT_TYPE.MARKET_INFO:
        return await this.repo.updateOne(macro, {
          marketInfo: { summaries: [...macro.marketInfo.summaries, summary] },
        });
      case REPORT_TYPE.DEBENTURE:
        return await this.repo.updateOne(macro, {
          debenture: { summaries: [...macro.debenture.summaries, summary] },
        });
      case REPORT_TYPE.ECONOMY:
        return await this.repo.updateOne(macro, {
          economy: { summaries: [...macro.economy.summaries, summary] },
        });
      case REPORT_TYPE.INVEST:
        return await this.repo.updateOne(macro, {
          invest: { summaries: [...macro.invest.summaries, summary] },
        });
    }
  }
}
