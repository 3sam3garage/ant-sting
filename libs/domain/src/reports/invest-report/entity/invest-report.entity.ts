import { Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { plainToInstance } from 'class-transformer';

@Entity({ name: 'invest-reports' })
export class InvestReport extends BaseReportEntity {
  static create(data: Partial<InvestReport>) {
    return plainToInstance(InvestReport, data);
  }
}
