import { IsString, Matches } from 'class-validator';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class FindReportQuery {
  @Matches(DATE_FORMAT_REGEX)
  @IsString()
  date: string;
}
