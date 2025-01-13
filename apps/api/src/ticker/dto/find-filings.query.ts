import { FindByDateQuery } from '../../components';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindFilingsQuery extends FindByDateQuery {
  @ApiProperty({ type: String, isArray: true, required: true })
  @IsString({ each: true })
  tickers: string[];
}
