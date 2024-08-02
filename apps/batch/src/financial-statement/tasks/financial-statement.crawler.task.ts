import { Injectable } from '@nestjs/common';
import { InvestReport, InvestReportRepository } from '@libs/domain';

@Injectable()
export class FinancialStatementCrawlerTask {
  constructor(private readonly repo: InvestReportRepository) {}

  async exec(): Promise<void> {
    const entity = InvestReport.create({ title: 'financial-statement' });
    await this.repo.createOne(entity);
  }
}
