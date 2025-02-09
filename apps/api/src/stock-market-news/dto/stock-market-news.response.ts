import { IsString, ValidateNested } from 'class-validator';
import { Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { plainToInstance, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Analysis {
  @Column()
  reason: string;

  @Column()
  score: number;
}

export class StockMarketNewsResponse {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString({ each: true })
  tickers: string[];

  @IsString({ each: true })
  summaries: string[];

  @Type(() => Analysis)
  @ValidateNested()
  items: Analysis;

  static fromEntity(data: Partial<StockMarketNewsResponse>) {
    return plainToInstance(StockMarketNewsResponse, data);
  }
}
