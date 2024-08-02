import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialStatementCrawlerTask {
  async exec(): Promise<void> {
    console.log('financial-statement');
  }
}
