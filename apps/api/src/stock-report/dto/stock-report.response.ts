import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { MARKET_TYPE, StockReport } from '@libs/domain';
import { plainToInstance } from 'class-transformer';

export class StockReportResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  market: MARKET_TYPE;

  @ApiProperty()
  stockName: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  stockFirm: string;

  @ApiProperty()
  file: string;

  @ApiProperty({ example: '2024-08-08' })
  date: string;

  static fromEntity(entity: StockReport) {
    return plainToInstance(StockReportResponse, entity);
  }
}
