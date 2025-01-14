import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { FindByDateQuery } from '../../components';

export class FindFilingsQuery extends FindByDateQuery {
  @ApiProperty({ type: String, isArray: true, required: true })
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => `${value}`.split(','))
  tickers?: string[] = [];
}
