import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DATE_FORMAT_REGEX } from '@libs/common/constants';

export class FindByDateQuery {
  @ApiProperty()
  @Matches(DATE_FORMAT_REGEX)
  @IsString()
  date: string;
}
