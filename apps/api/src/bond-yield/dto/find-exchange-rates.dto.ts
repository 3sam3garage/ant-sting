import { FindByDateQuery } from '../../components';
import { IsEnum } from 'class-validator';
import { BOND_COUNTRIES } from '@libs/domain';
import { ApiProperty } from '@nestjs/swagger';

export class FindBondYieldsQuery extends FindByDateQuery {
  @ApiProperty({ enum: BOND_COUNTRIES, isArray: true, required: true })
  @IsEnum(BOND_COUNTRIES, { each: true })
  countries: BOND_COUNTRIES[];
}
