import { FindByDateQuery } from '../../components';
import { IsEnum } from 'class-validator';
import { INTEREST_COUNTRIES } from '@libs/domain';
import { ApiProperty } from '@nestjs/swagger';

export class FindInterestRatesQuery extends FindByDateQuery {
  @ApiProperty({ enum: INTEREST_COUNTRIES, isArray: true, required: true })
  @IsEnum(INTEREST_COUNTRIES, { each: true })
  countries: INTEREST_COUNTRIES[] = [];
}
