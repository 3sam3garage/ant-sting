import { Module } from '@nestjs/common';
import {
  CorporationDomainModule,
  FinancialStatementDomainModule,
} from '@libs/domain';
import { CorporationCommand } from './commands';
import { CorporationUpdateIdTask, FinancialStatementTask } from './tasks';

@Module({
  imports: [CorporationDomainModule, FinancialStatementDomainModule],
  providers: [
    CorporationCommand,
    CorporationUpdateIdTask,
    FinancialStatementTask,
  ],
})
export class CorporationBatchModule {}
