import { Module } from '@nestjs/common';
import { CorporationDomainModule } from '@libs/domain';
import { CorporationCommand } from './commands';
import { CorporationUpdateIdTask } from './tasks';

@Module({
  imports: [CorporationDomainModule],
  providers: [CorporationCommand, CorporationUpdateIdTask],
})
export class CorporationBatchModule {}
