import { Module } from '@nestjs/common';
import { InvestReportDomainModule } from '@libs/domain';
import { TestCommand } from './commands';
import { TestTask } from './tasks';

@Module({
  imports: [InvestReportDomainModule],
  providers: [TestCommand, TestTask],
})
export class TestBatchModule {}
