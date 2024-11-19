import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MARKET_POSITION } from '@libs/domain';
import { IsEnum, IsNumber, IsString } from 'class-validator';
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
  @IsNumber()
  score: number;

  @Column()
  @IsString()
  reason: string;
}

export class FinancialStatementAnalysis {
  @Column()
  @IsString()
  revenue: string;

  @Column()
  @IsString()
  'net-income': string;

  @Column()
  @IsString()
  'total-assets': string;

  @Column()
  @IsString()
  'debt-ratio': string;

  @Column()
  @IsString()
  equity: string;

  @Column()
  @IsString()
  'current-ratio': string;

  @Column()
  @IsString()
  'return-on-equity': string;

  @Column()
  @IsString()
  'return-on-assets': string;

  @Column()
  @IsString({ each: true })
  insights: string[];
}

@Entity({ name: 'stock-analysis' })
export class StockAnalysis extends BaseEntity {
  @Column()
  @IsNumber()
  price: number;

  @Column(() => ReportAnalysis)
  reportAnalysis: ReportAnalysis;

  @Column(() => AiAnalysis)
  aiAnalysis: AiAnalysis;

  @Column(() => FinancialStatementAnalysis)
  financialStatement: FinancialStatementAnalysis;

  static create(data: Partial<StockAnalysis>) {
    return plainToInstance(StockAnalysis, data);
  }
}
