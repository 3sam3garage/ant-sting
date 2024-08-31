import { Module } from '@nestjs/common';
import { CorporationDomainModule } from '@libs/domain';
import { CorporationCommand } from './commands';
import { CorporationUpdateIdTask, FinancialStatementTask } from './tasks';

@Module({
  imports: [CorporationDomainModule],
  providers: [
    CorporationCommand,
    CorporationUpdateIdTask,
    FinancialStatementTask,
  ],
})
export class CorporationBatchModule {}
