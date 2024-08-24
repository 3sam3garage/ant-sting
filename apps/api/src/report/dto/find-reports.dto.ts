import { IsString, Matches } from 'class-validator';
import { DATE_FORMAT_REGEX } from '../constants';

export class FindReportQuery {
  @Matches(DATE_FORMAT_REGEX)
  @IsString()
  date: string;
}
