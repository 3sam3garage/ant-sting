import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { FindByDateQuery } from '../../components';
import { Transform } from 'class-transformer';

export class FindFilingsQuery extends PartialType(FindByDateQuery) {
  @ApiProperty({ default: '2025-01-01', required: false })
  @IsString({ each: true })
  @IsOptional()
  tickers: string[] = [];

  @ApiProperty({ default: '2025-04-01', required: false })
  @IsString({ each: true })
  @IsOptional()
  formTypes: string[] = [];

  @ApiProperty()
  @Transform(({ value }) => !!value)
  @IsBoolean()
  @IsOptional()
  withAnalysis?: boolean;
}
