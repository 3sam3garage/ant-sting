import { Module } from '@nestjs/common';
import { ExternalApiModule } from '@libs/external-api';
import { PolyMarketCommand } from './commands';
import { ScrapePollTask } from './tasks';

@Module({
  imports: [ExternalApiModule],
  providers: [PolyMarketCommand, ScrapePollTask],
})
export class PolyMarketBatchModule {}
