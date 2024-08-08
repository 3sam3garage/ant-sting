import { Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { plainToInstance } from 'class-transformer';

@Entity({ name: 'debenture-reports' })
export class DebentureReport extends BaseReportEntity {
  static create(data: Partial<DebentureReport>) {
    return plainToInstance(DebentureReport, data);
  }
}
