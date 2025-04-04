import { IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FindByDateQuery } from '../../components';

export class FindShortInterestQuery extends PartialType(FindByDateQuery) {
  @ApiProperty()
  @IsString()
  ticker: string;
}
