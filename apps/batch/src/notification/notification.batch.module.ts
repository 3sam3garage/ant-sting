import { Module } from '@nestjs/common';
import {
  StockAnalysisDomainModule,
  EconomicInformationAnalysisDomainModule,
} from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';
import { NotificationCommand } from './commands';
import { SendSlackNotificationTask } from './tasks';

@Module({
  imports: [
    EconomicInformationAnalysisDomainModule,
    StockAnalysisDomainModule,
    ExternalApiModule,
  ],
  providers: [NotificationCommand, SendSlackNotificationTask],
})
export class NotificationBatchModule {}
