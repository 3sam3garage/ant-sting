import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CURRENCY_TYPE, MARKET_POSITION, MARKET_TYPE } from '../../constants';
import { BaseEntity } from '../../base.entity';

export class ReportAnalysis {
  @Column()
  @IsNumber()
  targetPrice: number;

  @Column()
  @IsEnum(MARKET_POSITION)
  position: MARKET_POSITION;
}

export class AiAnalysis {
  @Column()
  @IsNumber()
  targetPrice: number;

  @Column()
  @IsEnum(MARKET_POSITION)
  position: MARKET_POSITION;

  @Column()
  @IsString()
  reason: string;
}

@Entity({ name: 'stock-analysis' })
export class StockAnalysis extends BaseEntity {
  @Column({ comment: '시장 타입' })
  @IsEnum(MARKET_TYPE)
  market: MARKET_TYPE;

  @Column({ comment: '화폐 종류' })
  @IsEnum(CURRENCY_TYPE)
  currency: CURRENCY_TYPE;

  @Column({ comment: '동일 레포트인지 확인용' })
  @IsString()
  uuid: string;

  @Column()
  @IsNumber()
  price: number = 0;

  @Column()
  @IsString()
  stockCode: string;

  @Column()
  @IsString()
  stockName: string;

  @Column()
  @IsString()
  date: string;

  @Column(() => ReportAnalysis)
  reportAnalysis: ReportAnalysis;

  @Column(() => AiAnalysis)
  aiAnalysis: AiAnalysis;

  @ObjectIdColumn()
  stockReportId: ObjectId;

  static create(data: Partial<StockAnalysis>) {
    return plainToInstance(StockAnalysis, data);
  }
}
