import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { MARKET_POSITION } from '../../constants';
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
  @Column({ comment: '매출' })
  @IsString()
  revenue: string;

  @Column({ comment: '순이익' })
  @IsString()
  netIncome: string;

  @Column({ comment: '총자산' })
  @IsString()
  totalAssets: string;

  @Column({ comment: '부채비율' })
  @IsString()
  debtRatio: string;

  @Column({ comment: '자본' })
  @IsString()
  equity: string;

  @Column({ comment: '유동비율' })
  @IsString()
  currentRatio: string;

  @Column({ comment: 'ROE' })
  @IsString()
  returnOnEquity: string;

  @Column({ comment: 'ROA' })
  @IsString()
  returnOnAssets: string;

  @Column()
  @IsString({ each: true })
  insights: string[];
}

@Entity({ name: 'stock-analysis' })
export class StockAnalysis extends BaseEntity {
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

  @Column(() => FinancialStatementAnalysis)
  financialStatement: FinancialStatementAnalysis;

  static create(data: Partial<StockAnalysis>) {
    return plainToInstance(StockAnalysis, data);
  }
}
