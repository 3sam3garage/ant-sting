import { IsEnum } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { REPORT_SUMMARY_TYPE } from '../constants';
import { BaseReportEntity } from '../../base.report.entity';

@Entity({ name: 'report-summaries' })
export class ReportSummary extends BaseReportEntity {
  @Column()
  @IsEnum(REPORT_SUMMARY_TYPE)
  type: REPORT_SUMMARY_TYPE;

  static create(data: Partial<ReportSummary>) {
    return plainToInstance(ReportSummary, data);
  }
}
