import { IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindByDateQuery {
  // @ApiProperty()
  // @Matches(DATE_FORMAT_REGEX)
  // @IsString()
  // date: string;

  @ApiProperty()
  @IsISO8601()
  from: Date;

  @ApiProperty()
  @IsISO8601()
  to: Date;
}
