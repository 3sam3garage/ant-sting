import { Column, Entity } from 'typeorm';
import { BaseReportEntity } from '../../base.report.entity';
import { IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Entity({ name: 'industry-reports' })
export class IndustryReport extends BaseReportEntity {
  @Column()
  @IsString()
  industryType: string;

  static create(data: Partial<IndustryReport>) {
    return plainToInstance(IndustryReport, data);
  }
}
