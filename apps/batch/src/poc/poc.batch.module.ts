import { Module } from '@nestjs/common';
import { EconomicInformationDomainModule } from '@libs/domain';
import { AiModule } from '@libs/ai';
import { ExternalApiModule } from '@libs/external-api';
import { PocCommand } from './commands';
import { GraphEconomicInformationTask } from './tasks/graph-economic-information.task';
import { ScrapePolyMarketTask } from './tasks/scrape-poly-market.task';

@Module({
  imports: [AiModule, ExternalApiModule, EconomicInformationDomainModule],
  providers: [PocCommand, GraphEconomicInformationTask, ScrapePolyMarketTask],
})
export class PocBatchModule {}
