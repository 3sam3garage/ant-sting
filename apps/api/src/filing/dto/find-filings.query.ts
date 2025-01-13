import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class FindFilingsQuery {
  @ApiProperty({ type: String, isArray: true, required: true })
  @IsString({ each: true })
  @Transform(({ value }) => `${value}`.split(','))
  tickers: string[];
}
