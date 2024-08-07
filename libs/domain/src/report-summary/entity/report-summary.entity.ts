import { IsEnum, IsNumber, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { REPORT_SUMMARY_TYPE } from '../constants';

@Entity({ name: 'report-summaries' })
export class ReportSummary extends BaseEntity {
  @Column()
  @IsString()
  date: string;

  @Column()
  @IsEnum(REPORT_SUMMARY_TYPE)
  type: string;

  @Column()
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;

  static create(data: Partial<ReportSummary>) {
    return plainToInstance(ReportSummary, data);
  }
}
