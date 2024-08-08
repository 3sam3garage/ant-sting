import { Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { plainToInstance } from 'class-transformer';

@Entity({ name: 'market-info-reports' })
export class MarketInfoReport extends BaseReportEntity {
  static create(data: Partial<MarketInfoReport>) {
    return plainToInstance(MarketInfoReport, data);
  }
}
