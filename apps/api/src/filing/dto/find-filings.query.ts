import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { FindByDateQuery } from '../../components';
// import { FILINGS_TO_ANALYZE } from '@libs/domain';

export class FindFilingsQuery extends FindByDateQuery {
  @ApiProperty({ type: String, isArray: true, required: false })
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => `${value}`.split(','))
  tickers: string[] = [];

  @ApiProperty({ type: String, isArray: true, required: false })
  @IsString({ each: true })
  @Transform(({ value }) => `${value}`.split(',').filter((item) => item))
  @IsOptional()
  formTypes: string[] = [];
}
