import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import axios from 'axios';
import { ObjectId } from 'typeorm';
import { QUEUE_NAME } from '@libs/config';
import { joinUrl } from '@libs/common';
import { Filing, FilingRepository, TickerRepository } from '@libs/domain';
import { BaseConsumer } from '../../base.consumer';
import { DATA_SEC_GOV_HEADERS } from '../constants';
import { SecFiling } from '../interface';

@Processor(QUEUE_NAME.FETCH_FILING)
export class FetchFilingConsumer extends BaseConsumer {
  private DOCUMENT_PATH = 'https://www.sec.gov/Archives/edgar/data';

  constructor(
    @InjectQueue(QUEUE_NAME.ANALYZE_FILING)
    private readonly queue: Queue,
    private readonly tickerRepository: TickerRepository,
    private readonly filingRepository: FilingRepository,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { tickerId } }: Job<{ tickerId: string }>) {
    const tickerInfo = await this.tickerRepository.findOne({
      where: { _id: new ObjectId(tickerId) },
    });

    if (!tickerInfo) {
      return;
    }

    const { tenDigitCIK, cik, ticker } = tickerInfo;

    const res = await axios.get<SecFiling>(
      `https://data.sec.gov/submissions/${tenDigitCIK}.json`,
      { headers: DATA_SEC_GOV_HEADERS },
    );

    const { accessionNumber, primaryDocument, filingDate } =
      res?.data?.filings?.recent;
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

      await this.queue.add(QUEUE_NAME.ANALYZE_FILING, { filingId: result._id });
    }
  }
}
