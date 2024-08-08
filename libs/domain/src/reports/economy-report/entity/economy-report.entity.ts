import { Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { plainToInstance } from 'class-transformer';

@Entity({ name: 'economy-reports' })
export class EconomyReport extends BaseReportEntity {
  static create(data: Partial<EconomyReport>) {
    return plainToInstance(EconomyReport, data);
  }
}
