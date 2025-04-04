import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { ShortInterest } from '@libs/domain';
import { plainToInstance } from 'class-transformer';

export class ShortInterestItem {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  averageDailyVolume: number;

  @ApiProperty()
  date: string;
}

export class ShortInterestResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  stockName: string;

  @ApiProperty()
  ticker: string;

  @ApiProperty()
  items: ShortInterestItem[] = [];

  static fromEntity(entity: ShortInterest) {
    return plainToInstance(ShortInterestResponse, entity);
  }
}
