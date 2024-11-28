import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import {
  CURRENCY_TYPE,
  MARKET_POSITION,
  MARKET_TYPE,
  StockAnalysis,
} from '@libs/domain';
import { plainToInstance } from 'class-transformer';

class ReportAnalysis {
  @ApiProperty()
  targetPrice: number;

  @ApiProperty()
  position: MARKET_POSITION;
}

class AiAnalysis {
  @ApiProperty()
  targetPrice: number;

  @ApiProperty()
  position: MARKET_POSITION;

  @ApiProperty()
  reason: string;
}

export class StockAnalysisResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  price: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  stockCode: string;

  @ApiProperty()
  stockName: string;

  @ApiProperty({ description: 'yyyy-MM-dd' })
  date: string;

  @ApiProperty()
  market: MARKET_TYPE;

  @ApiProperty()
  currency: CURRENCY_TYPE;

  @ApiProperty()
  reportAnalysis: ReportAnalysis;

  @ApiProperty()
  aiAnalysis: AiAnalysis;

  static fromEntity(entity: StockAnalysis) {
    return plainToInstance(StockAnalysisResponse, entity);
  }
}
