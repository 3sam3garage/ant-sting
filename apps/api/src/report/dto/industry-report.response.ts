import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseReportResponse } from './base-report.response';

export class IndustryReportResponse extends BaseReportResponse {
  @ApiProperty()
  @IsString()
  industryType: string;
}
