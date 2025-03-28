import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FindByDateQuery } from '../../components';

export class FindAnalysisQuery extends PartialType(FindByDateQuery) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  stockCode?: string;
}
