import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { CURRENCY_TYPE } from '@libs/domain';

export class ExchangeRateResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  baseCurrency: CURRENCY_TYPE;

  @ApiProperty()
  targetCurrency: CURRENCY_TYPE;

  @ApiProperty()
  exchangeRate: number;

  @ApiProperty({ example: '2024-08-08' })
  date: string;
}
