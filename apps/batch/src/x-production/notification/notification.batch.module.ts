import { Module } from '@nestjs/common';
import {
  EconomicInformationDomainModule,
  StockReportDomainModule,
} from '@libs/domain';
import { ExternalApiModule } from '@libs/external-api';
import { NotificationCommand } from './commands';
import { SendSlackNotificationTask } from './tasks';

@Module({
  imports: [
    ExternalApiModule,
    StockReportDomainModule,
    EconomicInformationDomainModule,
  ],
  providers: [NotificationCommand, SendSlackNotificationTask],
})
export class NotificationBatchModule {}
