import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl } from '@libs/common';
import { Filing, FilingRepository, TickerRepository } from '@libs/domain';
import { BaseConsumer } from '../../base.consumer';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { SecApiService } from '@libs/external-api/services/sec-api.service';

@Processor(QUEUE_NAME.FETCH_FILING)
export class FetchFilingConsumer extends BaseConsumer {
  private DOCUMENT_PATH = 'https://www.sec.gov/Archives/edgar/data';

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_FILING)
    private readonly queue: Queue,
    private readonly tickerRepository: TickerRepository,
    private readonly filingRepository: FilingRepository,
    private readonly secApiService: SecApiService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { tickerId } }: Job<{ tickerId: string }>) {
    const tickerInfo = await this.tickerRepository.findOne({
      where: { _id: new ObjectId(tickerId) },
    });

    // 체크해서 보내므로 없을리는 없다.
    if (!tickerInfo) {
      Logger.debug(`Ticker not found: ${tickerId}`);
      return;
    }

    const { tenDigitCIK, cik, ticker } = tickerInfo;

    const filingInfos = await this.secApiService.fetchFilings(tenDigitCIK);

    const { accessionNumber, primaryDocument, filingDate } =
      filingInfos?.filings?.recent;
    for (let i = 0; i < accessionNumber.length; i++) {
      // const formType = form[i];
      // if (formType !== '8-K') {
      //   continue;
      // }

      const accessNum = accessionNumber[i]?.replaceAll('-', '');
      const document = primaryDocument[i];
      const date = filingDate[i];

      const url = joinUrl(
        this.DOCUMENT_PATH,
        cik.toString(),
        accessNum,
        document,
      );

      const foundEntity = await this.filingRepository.findOne({
        where: { url },
      });
      if (foundEntity) {
        continue;
      }

      const entity = Filing.create({ date, url, cik, ticker });
      const result = await this.filingRepository.save(entity);

      await this.queue.add({ filingId: result._id });
    }
  }
}
