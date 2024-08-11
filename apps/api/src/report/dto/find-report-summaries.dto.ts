import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { REPORT_SUMMARY_TYPE } from '@libs/domain';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class FindReportSummariesQuery {
  @Matches(DATE_FORMAT_REGEX)
  @IsString()
  date: string;

  @IsOptional()
  @IsEnum(REPORT_SUMMARY_TYPE, { each: true })
  types?: REPORT_SUMMARY_TYPE[];
}
