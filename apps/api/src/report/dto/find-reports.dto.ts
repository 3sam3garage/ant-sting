import { IsString, Matches } from 'class-validator';
import { DATE_FORMAT_REGEX } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

export class FindReportQuery {
  @ApiProperty()
  @Matches(DATE_FORMAT_REGEX)
  @IsString()
  date: string;
}
