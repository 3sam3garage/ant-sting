import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { addHours } from 'date-fns';

export class FindByDateQuery {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => addHours(value, 9))
  from: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => addHours(value, 9))
  to: Date;
}
