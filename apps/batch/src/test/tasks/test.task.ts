import { Injectable } from '@nestjs/common';
import { InvestReportRepository } from '@libs/domain';

@Injectable()
export class TestTask {
  constructor(private readonly repo: InvestReportRepository) {}

  async exec(): Promise<void> {
    const items = await this.repo.find({});

    console.log(items.length);
  }
}
