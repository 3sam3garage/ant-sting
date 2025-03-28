import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindByDateQuery } from '../../components';

export class FindStockQuery extends PartialType(FindByDateQuery) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  code?: string;
}
