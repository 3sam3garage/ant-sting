import { Column, Entity } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { MARKET_POSITION } from '../../../constants';
import { BaseReportEntity } from '../../base.report.entity';

@Entity({ name: 'stock-reports' })
export class StockReport extends BaseReportEntity {
  @Column({ comment: '종목명' })
  @IsString()
  market: string;

  @Column({ comment: '종목명' })
  @IsString()
  stockName: string;

  @Column({ comment: '종목코드' })
  @IsString()
  code: string;

  @Column({ comment: '목표가' })
  @IsString()
  targetPrice: number;

  @Column({ comment: '구매의견' })
  @IsEnum(MARKET_POSITION)
  position: MARKET_POSITION;

  static create(data: Partial<StockReport>) {
    return plainToInstance(StockReport, data);
  }
}
