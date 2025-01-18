import { FindByDateQuery } from '../../components';
import { IsEnum } from 'class-validator';
import { STOCK_INDEX_COUNTRIES } from '@libs/domain';
import { ApiProperty } from '@nestjs/swagger';

export class FindStockIndexesQuery extends FindByDateQuery {
  @ApiProperty({ enum: STOCK_INDEX_COUNTRIES, isArray: true, required: true })
  @IsEnum(STOCK_INDEX_COUNTRIES, { each: true })
  countries: STOCK_INDEX_COUNTRIES[] = [];
}
