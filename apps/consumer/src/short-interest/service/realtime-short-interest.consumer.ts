import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TickerRepository } from '@libs/domain';
import { QUEUE_NAME } from '@libs/config';
import { ClaudeService } from '@libs/ai';
import { BaseConsumer } from '../../base.consumer';

@Processor(QUEUE_NAME.SCRAPE_REALTIME_SHORT)
export class RealtimeShortInterestConsumer extends BaseConsumer {
  constructor(
    private readonly tickerRepository: TickerRepository,
    private readonly claudeService: ClaudeService,
  ) {
    super();
  }

  @Process({ concurrency: 1 })
  async run({ data: { ticker } }: Job<{ ticker: string }>) {
    console.log(ticker);
  }
}
