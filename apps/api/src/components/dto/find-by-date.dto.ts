import { IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindByDateQuery {
  @ApiProperty()
  @IsISO8601()
  from: Date;

  @ApiProperty()
  @IsISO8601()
  to: Date;
}
