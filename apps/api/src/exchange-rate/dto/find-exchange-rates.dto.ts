import { FindByDateQuery } from '../../components';
import { IsEnum } from 'class-validator';
import { CURRENCY_TYPE } from '@libs/domain';
import { ApiProperty } from '@nestjs/swagger';

export class FindExchangeRatesQuery extends FindByDateQuery {
  @ApiProperty({ enum: CURRENCY_TYPE, isArray: true, required: true })
  @IsEnum(CURRENCY_TYPE, { each: true })
  currency: CURRENCY_TYPE[];
}
